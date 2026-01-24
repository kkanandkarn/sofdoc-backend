import * as bcryptjs from "bcryptjs";
import { throwError } from "./helper";

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = 10;
    const hashedPassword: string = await new Promise((resolve, reject) => {
      bcryptjs.hash(password, saltRounds, function (err, hash) {
        if (err) {
          return reject(err instanceof Error ? err : new Error(err));
        }
        resolve(hash);
      });
    });
    return hashedPassword as string;
  } catch (error) {
    throwError(error);
  }
};
export const compare = async (original: string, password: string) => {
  return new Promise(function (resolve, reject) {
    bcryptjs.compare(password, original, function (err, isMatch) {
      if (err) {
        return reject(err instanceof Error ? err : new Error(err));
      } else {
        resolve(isMatch);
      }
    });
  });
};
