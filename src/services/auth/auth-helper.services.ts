import { prisma } from "../../../lib/prisma";

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
}
export default AuthHelper;
