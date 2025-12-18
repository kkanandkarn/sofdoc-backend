import { throwError } from "../../utils/helper";
import { BAD_REQUEST, CONFLICT, ErrorHandler } from "../../helper";
import { prisma } from "../../../lib/prisma";

class OtpHelper {
  async validateSendOtp(email: string, otpReason: string) {
    try {
      switch (otpReason) {
        case "REGISTER":
          return await this.validateRegisterOtp(email);
        default:
          throw new ErrorHandler(BAD_REQUEST, "Invalid Otp Reason");
      }
    } catch (e) {
      throwError(e);
    }
  }
  async validateRegisterOtp(email: string) {
    try {
      const user = await prisma.users.findFirst({ where: { email } });
      if (user) {
        throw new ErrorHandler(CONFLICT, "User with this email already exists");
      }
      return true;
    } catch (e) {
      throwError(e);
    }
  }
}

export default OtpHelper;
