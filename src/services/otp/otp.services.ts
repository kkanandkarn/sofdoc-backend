import {
  generateOtp,
  getLast24HoursDate,
  throwError,
} from "../../utils/helper";
import { prisma } from "../../../lib/prisma";
import {
  BAD_REQUEST,
  ErrorHandler,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../../helper";
import { SUCCESS } from "../../utils/constant";
import OtpHelper from "./otp-helper.services";

class Otp {
  async sendOtp(body) {
    try {
      const { email, otpReason } = body;

      await new OtpHelper().validateSendOtp(email, otpReason);

      const last24Hours = getLast24HoursDate();

      const otpCountRecord = await prisma.otpCount.findFirst({
        where: {
          email,
          otpReason,
          createdAt: {
            gte: last24Hours,
          },
          status: "ACTIVE",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (otpCountRecord?.otpCount >= 3) {
        throw new ErrorHandler(
          TOO_MANY_REQUESTS,
          "Maximum OTP limit reached for today. Please try again tomorrow.",
        );
      }

      const otp = generateOtp();

      if (otpCountRecord) {
        await prisma.otpCount.update({
          where: { id: otpCountRecord.id },
          data: {
            otpCount: otpCountRecord.otpCount + 1,
          },
        });
      } else {
        await prisma.otpCount.create({
          data: {
            email,
            otpReason,
            otp: otp,
            otpCount: 1,
          },
        });
      }
      const expiredAt = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.otp.create({
        data: {
          email,
          otp,
          otpReason,
          isUsed: false,
          expiredAt,
        },
      });

      return {
        message: SUCCESS,
      };
    } catch (e) {
      throwError(e);
    }
  }
  async verifyOtp(body) {
    try {
      const { email, otp, otpReason } = body;
      const otpRecord = await prisma.otp.findFirst({
        where: {
          email,
          otpReason,
          status: "ACTIVE",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // 2️⃣ If OTP not found
      if (!otpRecord) {
        throw new ErrorHandler(
          NOT_FOUND,
          "OTP not found. Please request a new OTP.",
        );
      }

      // 3️⃣ If OTP already used
      if (otpRecord.isUsed) {
        throw new ErrorHandler(BAD_REQUEST, "OTP has already been used.");
      }

      // 4️⃣ If OTP expired
      if (new Date() > otpRecord.expiredAt) {
        throw new ErrorHandler(
          BAD_REQUEST,
          "OTP has expired. Please request a new OTP.",
        );
      }

      // 5️⃣ If maximum attempts reached
      if (otpRecord.attempts >= 3) {
        throw new ErrorHandler(
          TOO_MANY_REQUESTS,
          "Maximum OTP verification attempts reached.",
        );
      }

      // 6️⃣ If OTP does not match → increment attempt
      if (otpRecord.otp !== otp) {
        await prisma.otp.update({
          where: { id: otpRecord.id },
          data: {
            attempts: otpRecord.attempts + 1,
          },
        });

        throw new ErrorHandler(UNAUTHORIZED, "Invalid OTP.");
      }

      // 7️⃣ OTP verified successfully → mark as used
      await prisma.otp.update({
        where: { id: otpRecord.id },
        data: {
          isUsed: true,
          status: "INACTIVE",
        },
      });

      return {
        message: "OTP verified successfully.",
      };
    } catch (e) {
      throwError(e);
    }
  }
}
export default Otp;
