import jwt from "jsonwebtoken";
import { TokenData } from "./interface";

const token = (tokenData: TokenData) => {
  return jwt.sign(tokenData, process.env.JWT_PRIVATE_KEY);
};

export default token;
