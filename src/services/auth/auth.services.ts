import { generateUniqueId, throwError } from "../../utils/helper";
import { LINK_PROGRAM_CODES, STATUS, SUCCESS } from "../../utils/constant";
import { prisma } from "../../../lib/prisma";
import { compare, hashPassword } from "../../utils/hash";
import {
  BAD_REQUEST,
  CONFLICT,
  ErrorHandler,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../../helper";
import token from "../../utils/token";
import AuthHelper from "./auth-helper.services";
import { Upload } from "../upload";
import {
  ApiResponse,
  UserDetailsResponse,
  FileUploadResponse,
  LinkDetailsRequest,
  LinkDetailsResponse,
  ResendRegistrationRequest,
  ActivateUserAccountRequest,
} from "../../utils/interface";
import { AuthRepository } from "../../repository";
import AuthHelperServices from "./auth-helper.services";
import { MailService } from "../mail";

class AuthService {
  async login(body: any, tx: any) {
    try {
      const { username, password } = body;
      const user = await tx.users.findUnique({
        where: {
          username: username,
          NOT: {
            status: "DELETED",
          },
        },
      });

      if (!user) {
        throw new ErrorHandler(NOT_FOUND, "User not found");
      }
      if (user.status !== STATUS.ACTIVE || user.status !== STATUS.HOLD) {
        return {
          userData: {
            status: user.status,
          },
        };
      }
      const isCorrectPassword = await compare(user.password, password);
      if (!isCorrectPassword) {
        throw new ErrorHandler(UNAUTHORIZED, "Invalid Password");
      }

      let userData = await tx.users.findUnique({
        where: {
          username: username,
        },
        include: {
          tenant: true,
          role: {
            include: {
              globalRolePermissions: {
                include: {
                  globalTenantPermission: {
                    include: { permission: true },
                  },
                },
              },
            },
          },
        },
      });

      const permissions =
        userData?.role?.globalRolePermissions.map((grp) => ({
          permissionId: grp.permissionId,
          permissionName: grp.globalTenantPermission.permission.permissionName,
          parent: grp.globalTenantPermission.permission.parent,
        })) || [];

      delete userData.role.globalRolePermissions;
      const Token = token({
        userId: userData.id,
        roleId: userData.roleId,
        tenantId: userData.tenantId,
      });

      return {
        message: SUCCESS,
        userData,
        globalPermissions: permissions,
        token: Token,
      };
    } catch (e) {
      throwError(e);
    }
  }
  async register(body, files, tx): Promise<ApiResponse> {
    try {
      const { email, username, packageId = 1 } = body;

      const helper = new AuthHelper();
      const repository = new AuthRepository();
      const mailService = new MailService();

      const isDuplicateEmail = await helper.validateDuplicateEmail(email, tx);
      if (isDuplicateEmail) {
        throw new ErrorHandler(CONFLICT, "Email already exists.");
      }
      const isDuplicateUsername = await helper.validateDuplicateUsername(
        username,
        tx,
      );

      if (isDuplicateUsername) {
        throw new ErrorHandler(CONFLICT, "Username already exists.");
      }

      body = {
        ...body,
        packageId: packageId,
        status: "INACTIVE",
        userType: "INDIVIDUAL",
      };

      let newUser: UserDetailsResponse = await repository.createUser(body, tx);

      const linkId: string = await generateUniqueId();

      const { url } = await helper.generateRegisterUserLink(linkId);

      const linkDetails = {
        linkId: linkId,
        programCode: "REGISTRATION_REQUEST",
        linkData: { userId: newUser.id },
        expiredAt: new Date(Date.now() + 10 * 60 * 1000),
      };

      await repository.saveLinkDetails(linkDetails);

      await mailService.sendCreateUserMail(newUser, url, tx);

      if (files.picture) {
        const user = {
          ...newUser,
          userId: newUser.id,
        };
        const { url }: FileUploadResponse = await this.uploadUserPicture(
          files,
          user,
          tx,
        );

        await new AuthRepository().updateUser(
          newUser.id,
          {
            picture: url,
          },
          tx,
        );
      }

      return {
        message: SUCCESS,
      };
    } catch (e) {
      throwError(e);
    }
  }
  async uploadUserPicture(files, user, tx): Promise<FileUploadResponse> {
    try {
      if (!files) {
        throw new ErrorHandler(BAD_REQUEST, "File is required.");
      }
      const uploadData = await new Upload().uploadInternalFile(
        files,
        "picture",
        user,
        tx,
      );
      return uploadData;
    } catch (e) {
      throwError(e);
    }
  }
  async getLinkDetails(
    body: LinkDetailsRequest,
    tx: any,
  ): Promise<LinkDetailsResponse> {
    try {
      const { linkId } = body;
      const repository = new AuthRepository();
      const linkDetails: LinkDetailsResponse = await repository.getLinkDetails(
        linkId,
        tx,
      );
      if (!linkDetails) {
        throw new ErrorHandler(NOT_FOUND, "Link details not found");
      }

      if (linkDetails.status === "EXPIRED") {
        throw new ErrorHandler(BAD_REQUEST, "Link is expired.");
      }
      const now = new Date();

      if (now > new Date(linkDetails.expiredAt)) {
        throw new ErrorHandler(BAD_REQUEST, "Link is expired.");
      }

      console.log("LINK DETAILS DATA: ", linkDetails.linkData);

      if (linkDetails.linkData.password) {
        delete linkDetails.linkData.password;
      }

      return linkDetails;
    } catch (e) {
      throwError(e);
    }
  }
  async resendRegistrationRequest(
    body: ResendRegistrationRequest,
    tx: any,
  ): Promise<ApiResponse> {
    try {
      const { email } = body;
      const repository = new AuthRepository();
      const helper = new AuthHelper();
      const mailService = new MailService();

      const user: UserDetailsResponse = await repository.getUserByEmail(email);
      if (!user) {
        throw new ErrorHandler(
          NOT_FOUND,
          "User with this email does not exists.",
        );
      }
      if (user.status !== STATUS.INACTIVE) {
        throw new ErrorHandler(BAD_REQUEST, "No request found for this email.");
      }

      const linkId: string = await generateUniqueId();

      const { url } = await helper.generateRegisterUserLink(linkId);

      const linkDetails = {
        linkId: linkId,
        programCode: "REGISTRATION_REQUEST",
        linkData: { userId: user.id },
        expiredAt: new Date(Date.now() + 10 * 60 * 1000),
      };

      await repository.saveLinkDetails(linkDetails);

      await mailService.sendCreateUserMail(user, url, tx);

      return {
        message: SUCCESS,
      };
    } catch (e) {
      throwError(e);
    }
  }
  async activateAccount(
    body: ActivateUserAccountRequest,
    tx: any,
  ): Promise<ApiResponse> {
    const { linkId, password } = body;
    const repository = new AuthRepository();
    const linkDetails = await repository.getLinkDetails(linkId, tx);
    if (!linkDetails) {
      throw new ErrorHandler(NOT_FOUND, "Invalid link.");
    }
    if (linkDetails.programCode !== LINK_PROGRAM_CODES.REGISTRATION_REQUEST) {
      throw new ErrorHandler(NOT_FOUND, "Invalid link.");
    }
    if (linkDetails.status === STATUS.EXPIRED) {
      throw new ErrorHandler(
        BAD_REQUEST,
        "Link is expired. Please request a new link",
      );
    }

    const now = new Date();
    const expiredAt = new Date(linkDetails.expiredAt);

    if (expiredAt <= now) {
      throw new ErrorHandler(
        BAD_REQUEST,
        "Link is expired. Please request a new link.",
      );
    }
    const userId = linkDetails.linkData.userId;
    const user = await repository.getUserDetails(userId, tx);
    if (user.status !== STATUS.INACTIVE) {
      throw new ErrorHandler(
        BAD_REQUEST,
        "Reqistration request already fulfilled",
      );
    }

    await repository.updateLinkDetails(linkId, { status: STATUS.EXPIRED }, tx);
    const hashedPassword: string = await hashPassword(password);
    await repository.updateUser(userId, {
      password: hashedPassword,
      status: "ACTIVE",
    });

    return {
      message: SUCCESS,
    };
  }
}
export default AuthService;
