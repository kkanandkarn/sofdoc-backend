import express from "express";
import { Auth } from "../../services";
import { prisma } from "../../../lib/prisma";

export const login = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    // const data = await prisma.$transaction(async (tx) => {
    //   return new Auth().login(req.body, tx);
    // });
    const data = await new Auth().login(req.body);
    return data;
  } catch (e) {
    next(e);
  }
};
