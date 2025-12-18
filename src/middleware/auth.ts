import express from "express";
import jwt from "jsonwebtoken";

const validateToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  let user = { isAuth: false };
  req.user = user;

  if (!token || token == "null") return next();

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
  } catch (err) {
    return next();
  }

  if (!decoded) return next();

  user = { ...user, isAuth: true, ...decoded };
  req.user = user;
  return next();
};

export default validateToken;
