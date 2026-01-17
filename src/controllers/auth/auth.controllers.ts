import express from "express";
import { AuthService } from "../../services";
import { prisma } from "../../../lib/prisma";
import { formidableUpload } from "../../utils/upload";
import { formValidator } from "../../middleware";

export const login = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const data = await prisma.$transaction(async (tx) => {
      return new AuthService().login(req.body, tx);
    });
    // const data = await new Auth().login(req.body);
    return data;
  } catch (e) {
    next(e);
  }
};
export const register = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { fields, files } = await formidableUpload(req);
    await formValidator("registerUser", fields);
    const data = await prisma.$transaction(async (tx) => {
      return new AuthService().register(fields, files, tx);
    });
    return data;
  } catch (e) {
    next(e);
  }
};
