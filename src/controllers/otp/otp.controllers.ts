import { Otp } from "../../services";
import express from "express";

export const sendOtp = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const data = await new Otp().sendOtp(req.body);
    return data;
  } catch (e) {
    next(e);
  }
};

export const verifyOtp = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const data = await new Otp().verifyOtp(req.body);
    return data;
  } catch (e) {
    next(e);
  }
};
