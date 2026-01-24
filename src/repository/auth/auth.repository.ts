import {
  CreateUserRequest,
  UserDetailsResponse,
  GlobalPermissionResposne,
  LinkDetailsRequest,
  LinkDetailsResponse,
  UpdateUserRequest,
  User,
  ApiResponse,
} from "../../utils/interface";
import { throwError } from "../../utils/helper";
import { prisma } from "../../../lib/prisma";
import { SUCCESS } from "../../utils/constant";

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
    userId: number,
    body: UpdateUserRequest,
    db: any = prisma,
  ): Promise<UserDetailsResponse> {
    try {
      const user = await db.users.update({
        where: {
          id: userId,
        },
        data: body,
      });
      return user;
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
  async updateLinkDetails(
    linkId: string,
    linkDetails: Record<string, any>,
    db: any = prisma,
  ): Promise<ApiResponse> {
    try {
      await db.linkDetails.update({
        where: {
          linkId,
        },
        data: linkDetails,
      });
      return {
        message: SUCCESS,
      };
    } catch (e) {
      throwError(e);
    }
  }
  async getUserDetails(
    userId: number,
    db: any = prisma,
  ): Promise<UserDetailsResponse> {
    try {
      const user = await db.users.findUnique({
        where: {
          id: userId,
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
