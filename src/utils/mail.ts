import { throwError } from "./helper";
import { prisma } from "../../lib/prisma";
import { BAD_REQUEST, ErrorHandler, FORBIDDEN, UNAUTHORIZED } from "../helper";

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const sendMail = async (
  email: string,
  subject: string,
  html: string,
  db: any = prisma,
): Promise<{ success: boolean }> => {
  if (process.env.NODE_ENV === "development") {
    const isWhiteListedEmail: boolean = await checkWhitelistedEmail(email, db);
    if (!isWhiteListedEmail) {
      throw new ErrorHandler(
        UNAUTHORIZED,
        "Your email is not whitelisted. Please contract administrator",
      );
    }
  }

  let mailOptions = {
    to: email,
    from: process.env.EMAIL,
    subject: subject,
    importance: "high",
    html: html,
  };

  await transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log("Message sent: %s", info?.messageId);
    console.log("Preview URL: %s", nodemailer?.getTestMessageUrl(info));
  });
  console.log("message sent sucess");
  return { success: true };
};
const checkWhitelistedEmail = async (
  email: string,
  db: any = prisma,
): Promise<boolean> => {
  try {
    const whitelistedEmail = await db.WhitelistEmail.findUnique({
      where: { email: email },
    });
    return !!whitelistedEmail;
  } catch (e) {
    throwError(e);
  }
};
export default sendMail;
