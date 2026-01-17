import express from "express";
import schemas from "../validations";
import { BAD_REQUEST, ErrorHandler } from "../helper";
import { throwError, transformVariable } from "../utils/helper";

const formValidator = (schemaName: string, fields?: any) => {
  try {
    const schema = schemas[schemaName];
    console.log({ key: schemaName });
    if (!schema) {
      return true;
    } else if (!transformVariable(fields)) {
      throw new ErrorHandler(BAD_REQUEST, "Payload is missing");
    } else {
      const { error } = schema.validate(fields);
      if (error) throw new ErrorHandler(BAD_REQUEST, error.message);
      else true;
    }
  } catch (error) {
    throwError(error);
  }
};

export default formValidator;
