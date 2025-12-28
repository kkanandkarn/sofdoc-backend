import { ApiError, File, FileMimeType } from "./interface";
import { BAD_REQUEST, ErrorHandler, INTERNAL_SERVER_ERROR } from "../helper";
import { ALLOWED_MIME_TYPES, SERVER_ERROR_MESSAGE } from "./constant";
import camelcaseKeys from "camelcase-keys";
import * as crypto from "node:crypto";

export const throwError = (error: ApiError) => {
  if (error.statusCode) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
  console.log(error);
  throw new ErrorHandler(INTERNAL_SERVER_ERROR, SERVER_ERROR_MESSAGE);
};

export const camelize = (obj: any, stopPaths: string[] = []) => {
  try {
    return camelcaseKeys(JSON.parse(JSON.stringify(obj)), {
      deep: true,
      stopPaths: stopPaths,
    });
  } catch (error) {
    throw new ErrorHandler(INTERNAL_SERVER_ERROR, error);
  }
};

export const generateOtp = (): string => {
  // Generates a secure random number between 1000–9999
  const otp = crypto.randomInt(1000, 10000);
  return otp.toString();
};
export const getLast24HoursDate = (): Date =>
  new Date(Date.now() - 24 * 60 * 60 * 1000);

export const getFile = (
  files: any,
  key = "document",
  fileType = "all",
): File => {
  try {
    const file: File = files[key];
    if (!file) {
      throw new ErrorHandler(BAD_REQUEST, "File not found");
    }
    const mimeType = file.mimetype;
    const allowedMimeTypes = ALLOWED_MIME_TYPES[fileType];
    if (!allowedMimeTypes.includes(mimeType)) {
      throw new ErrorHandler(BAD_REQUEST, "File type is not supported");
    }
    return file;
  } catch (e) {
    throwError(e);
  }
};
