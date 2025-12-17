import express from "express";

export interface ApiError {
  statusCode: number;
  message: string;
}

export interface Dispatcher {
  req: express.Request;
  res: express.Response;
  next: express.NextFunction;
  func: Function;
  resource?: string;
  perm?: string;
  stopPaths?: string[];
}

export interface TokenData {
  [key: string]: string | number | boolean | object;
}
