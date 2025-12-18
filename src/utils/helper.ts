import { ApiError } from "./interface";
import { ErrorHandler, SERVER_ERROR } from "../helper";
import { SERVER_ERROR_MESSAGE } from "./constant";
import camelcaseKeys from "camelcase-keys";
import * as crypto from "node:crypto";

export const throwError = (error: ApiError) => {
  if (error.statusCode) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
  console.log(error);
  throw new ErrorHandler(SERVER_ERROR, SERVER_ERROR_MESSAGE);
};

export const camelize = (obj, stopPaths = []) => {
  try {
    return camelcaseKeys(JSON.parse(JSON.stringify(obj)), {
      deep: true,
      stopPaths: stopPaths,
    });
  } catch (error) {
    throw new ErrorHandler(SERVER_ERROR, error);
  }
};

export const generateOtp = (): string => {
  // Generates a secure random number between 1000–9999
  const otp = crypto.randomInt(1000, 10000);
  return otp.toString();
};

export const getLast24HoursDate = () => {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return last24Hours;
};
