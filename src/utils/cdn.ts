import express from "express";
import * as path from "path";
import { prisma } from "../../lib/prisma";
import axios from "axios";
import mime from "mime-types";
import { Readable } from "stream";

export const download = async (
  fileUrl: string,
  res?: any,
): Promise<Buffer | void> => {
  if (!fileUrl) {
    throw new Error("File URL is required");
  }

  fileUrl = decodeURIComponent(fileUrl);

  // Fetch from Cloudinary (or any public URL)
  const response = await axios.get(fileUrl, {
    responseType: "stream",
  });

  const stream = response.data as Readable;

  if (res) {
    // Content-Type
    let contentType =
      response.headers["content-type"] || "application/octet-stream";

    if (contentType === "application/octet-stream") {
      const inferred = mime.getType(fileUrl);
      if (inferred) contentType = inferred;
    }

    // Content-Length (if available)
    if (response.headers["content-length"]) {
      res.setHeader("Content-Length", response.headers["content-length"]);
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    // stream to browser / embed
    stream.pipe(res);
  } else {
    // return Buffer (same as S3 behavior)
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];

      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
  }
};

export const getCdnFile = async (
  req: express.Request,
  res: express.Response,
) => {
  const fullPath = req.path;
  console.log("FULL PATH: ", fullPath);
  const fileName = path.basename(fullPath);

  const fileId = path.parse(fileName).name;
  console.log("FILE ID: ", fileId);

  const extension = path.parse(fileName).ext.replace(".", "");
  const file = await prisma.urlMapper.findUnique({
    where: {
      fileId,
    },
  });
  console.log(file);
  await download(file.originalUrl, res);
};
