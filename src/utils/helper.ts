import { ApiError } from "./interface";
import { ErrorHandler, SERVER_ERROR } from "../helper";
import { SERVER_ERROR_MESSAGE } from "./constant";
import camelcaseKeys from "camelcase-keys";

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
