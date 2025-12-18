import * as Joi from "joi";

const otpSchema = {
  otp_send_otp_post: Joi.object({
    email: Joi.string().trim().email().required().messages({
      "string.base": "Email must be a text value",
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email is required",
    }),

    otpReason: Joi.string().trim().required().messages({
      "string.base": "OTP reason must be a text value",
      "any.required": "OTP reason is required",
      "string.empty": "OTP reason is required",
    }),
  }),
  otp_verify_otp_post: Joi.object({
    email: Joi.string().trim().email().required().messages({
      "string.base": "Email must be a text value",
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email is required",
    }),
    otp: Joi.string().trim().required().messages({
      "string.base": "OTP must be a text value",
      "any.required": "OTP is required",
      "string.empty": "OTP is required",
    }),
    otpReason: Joi.string().trim().required().messages({
      "string.base": "OTP reason must be a text value",
      "any.required": "OTP reason is required",
      "string.empty": "OTP reason is required",
    }),
  }),
};

export default otpSchema;
