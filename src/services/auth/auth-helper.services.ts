import { prisma } from "../../../lib/prisma";
import { generateUniqueId, throwError } from "../../utils/helper";
import { CreateUserResponse } from "../../utils/interface";
import { FRONTEND_ROUTES } from "../../utils/constant";

class AuthHelper {
  async validateDuplicateEmail(
    email: string,
    db: any = prisma,
  ): Promise<boolean> {
    const user = await db.users.findFirst({
      where: {
        email: email,
        NOT: {
          status: "DELETED",
        },
      },
    });
    return !!user;
  }
  async validateDuplicateUsername(
    username: string,
    db: any = prisma,
  ): Promise<boolean> {
    const user = await db.users.findFirst({
      where: {
        username: username,
        NOT: {
          status: "DELETED",
        },
      },
    });
    return !!user;
  }
  async generateRegisterUserLink(linkId: string): Promise<{ url: string }> {
    try {
      const url =
        process.env.FRONTEND_URL + FRONTEND_ROUTES.verifyLink + linkId;
      return { url };
    } catch (e) {
      throwError(e);
    }
  }
}
export default AuthHelper;
