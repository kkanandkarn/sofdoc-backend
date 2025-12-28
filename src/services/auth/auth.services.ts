import { throwError } from "../../utils/helper";
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
import Upload from "../upload/upload.services";

class Auth {
  async login(body) {
    try {
      const { username, password } = body;
      const user = await prisma.users.findFirst({
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

      let userData = await prisma.users.findUnique({
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
  async register(body, files, tx) {
    try {
      const { name, email, username } = body;
      const isDuplicateEmail = await new AuthHelper().validateDuplicateEmail(
        email,
        tx,
      );
      if (isDuplicateEmail) {
        throw new ErrorHandler(CONFLICT, "Email already exists.");
      }
      const isDuplicateUsername =
        await new AuthHelper().validateDuplicateUsername(username, tx);

      if (isDuplicateUsername) {
        throw new ErrorHandler(CONFLICT, "Username already exists.");
      }

      const newUser = await tx.users.create({
        data: {
          name: name,
          email: email,
          status: "INACTIVE",
          userType: "INDIVIDUAL",
        },
      });
    } catch (e) {
      throwError(e);
    }
  }
  async updateUserPicture(body, files, tx) {
    try {
      if (!files) {
        throw new ErrorHandler(BAD_REQUEST, "File is required.");
      }

      const uploadData = await new Upload().cloudinaryUpload(
        body,
        files,
        "picture",
        tx,
      );
    } catch (e) {
      throwError(e);
    }
  }
}
export default Auth;
