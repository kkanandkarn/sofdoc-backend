import { authSchema } from "./auth";
import { otpSchema } from "./otp";

const schemas = {
  ...authSchema,
  ...otpSchema,
};
export default schemas;
