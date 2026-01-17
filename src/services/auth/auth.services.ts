import { generateUniqueId, throwError } from "../../utils/helper";
import { STATUS, SUCCESS } from "../../utils/constant";
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
  CreateUserResponse,
  FileUploadResponse,
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
      const { email, username } = body;

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
        status: "INACTIVE",
        userType: "INDIVIDUAL",
      };

      let newUser: CreateUserResponse = await repository.createUser(body, tx);

      const { permissions } = await repository.getGlobalPermissions(tx);
      await repository.addUserPermissions(newUser.id, permissions, tx);

      const linkId: string = await generateUniqueId();

      const { url } = await helper.generateRegisterUserLink(linkId);

      const linkDetails = {
        linkId: linkId,
        linkData: newUser,
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
          {
            id: newUser.id,
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
}
export default AuthService;
