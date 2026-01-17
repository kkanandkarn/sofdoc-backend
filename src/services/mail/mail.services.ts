import { throwError } from "../../utils/helper";
import * as path from "path";
import ejs from "ejs";
import { CreateUserResponse } from "../../utils/interface";
import sendMail from "../../utils/mail";
import { prisma } from "../../../lib/prisma";

class MailService {
  async sendCreateUserMail(
    user: CreateUserResponse,
    link: string,
    db: any = prisma,
  ) {
    try {
      const templatePath = path.join(
        __dirname,
        `../../templates`,
        "register-user.ejs",
      );
      const data = {
        name: user.name,
        activationLink: link,
        year: new Date().getFullYear(),
      };
      const htmlContent = await ejs.renderFile(templatePath, data);
      const subject = "Activate your account";
      await sendMail(user.email, subject, htmlContent, db);
      return true;
    } catch (e) {
      throwError(e);
    }
  }
}
export default MailService;
