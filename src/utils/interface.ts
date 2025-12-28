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

export interface UploadResponse {
  fileName: string;
  originalFileName: string;
  url: string;
}

export interface UploadedFile {
  mimetype: FileMimeType;
  originalFilename: string;
  newFilename: string;
  size: number;
}
export interface FileMeta {
  mimetype: string;
  fileType: FileType;
  extension: string;
  size: number;
  sizeInMb: string;
}

export type FileType =
  | "image"
  | "pdf"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "video"
  | "audio";

export type FileMimeType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "application/vnd.ms-powerpoint"
  | "application/vnd.openxmlformats-officedocument.presentationml.presentation";

export interface GenerateFileName {
  fileName: string;
  originalFileName: string;
}

export interface UrlMapper {
  fileId: string;
  originalUrl: string;
  mapUrl: string;
  fileName: string;
  fileType: FileType;
  originalFileName: string;
  originalFileSize: number;
  mimeType: string;
  fileSize: string;
}

export interface File {
  filepath: string | null;
  newFilename: string | null;
  originalFilename: string | null;
  mimetype: FileMimeType;
  size: number | null;
  hashAlgorithm: string | null;
}
export interface User {
  userId: number;
  roleId?: number;
  tenantId?: number;
  userType: "INDIVIDUAL" | "ORGANISATION";
}
