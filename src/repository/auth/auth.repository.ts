import {
  CreateUserRequest,
  UserDetailsResponse,
  GlobalPermissionResposne,
  LinkDetailsRequest,
  LinkDetailsResponse,
  UpdateUserRequest,
  User,
} from "../../utils/interface";
import { throwError } from "../../utils/helper";
import { prisma } from "../../../lib/prisma";

class AuthRepository {
  async createUser(
    body: CreateUserRequest,
    db: any = prisma,
  ): Promise<UserDetailsResponse> {
    try {
      const user = await db.users.create({
        data: body,
      });
      return user;
    } catch (e) {
      throwError(e);
    }
  }
  async updateUser(
    body: UpdateUserRequest,
    db: any = prisma,
  ): Promise<UserDetailsResponse> {
    try {
      const user = await db.users.update({
        where: {
          id: body.id,
        },
        data: body,
      });
      return user;
    } catch (e) {
      throwError(e);
    }
  }
  async getGlobalPermissions(
    db: any = prisma,
  ): Promise<GlobalPermissionResposne> {
    try {
      const permissions = await db.globalPermissionMaster.findMany({
        where: {
          NOT: {
            status: "DELETED",
          },
        },
      });
      return { permissions };
    } catch (e) {
      throwError(e);
    }
  }
  async addUserPermissions(
    userId: string,
    permissions: any[],
    db: any = prisma,
  ) {
    try {
      if (!permissions?.length) return false;

      const data = permissions.map((permission) => ({
        userId,
        permissionId: permission.id, // from GlobalPermissionMaster
      }));

      await db.globalUserPermissions.createMany({
        data,
        skipDuplicates: true,
      });
      return true;
    } catch (e) {
      throwError(e);
    }
  }
  async saveLinkDetails(
    linkDetails: LinkDetailsRequest,
    db: any = prisma,
  ): Promise<boolean> {
    try {
      await db.linkDetails.create({
        data: linkDetails,
      });
      return true;
    } catch (e) {
      throwError(e);
    }
  }
  async getLinkDetails(
    linkId: string,
    db: any = prisma,
  ): Promise<LinkDetailsResponse> {
    try {
      const linkDetails: LinkDetailsResponse = await db.linkDetails.findUnique({
        where: {
          linkId: linkId,
          NOT: {
            status: "DELETED",
          },
        },
      });
      return linkDetails;
    } catch (e) {
      throwError(e);
    }
  }
  async getUserByEmail(
    email: string,
    db: any = prisma,
  ): Promise<UserDetailsResponse> {
    try {
      const user = await db.users.findUnique({
        where: {
          email: email,
        },
      });
      delete user.password;
      return user;
    } catch (e) {
      throwError(e);
    }
  }
}

export default AuthRepository;
