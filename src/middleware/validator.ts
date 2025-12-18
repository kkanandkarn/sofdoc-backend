import express from "express";
import schemas from "../validations";
import { BAD_REQUEST, ErrorHandler } from "../helper";

const validator = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  console.log(req.path);
  try {
    const key = `${req.path
      .split("/")
      .splice(2)
      .join("_")
      .split("-")
      .join("_")}_${req.method.toLowerCase()}`;

    const schema = schemas[key];
    console.log({ key: key });
    if (!schema) {
      return next();
    } else if (!req.body) {
      throw new ErrorHandler(BAD_REQUEST, "Payload is missing");
    } else {
      const { error } = schema.validate(req.body);
      if (error) throw new ErrorHandler(BAD_REQUEST, error.message);
      else next();
    }
  } catch (error) {
    next(error);
  }
};

export default validator;
