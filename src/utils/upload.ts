import { FormiddableResponse } from "./interface";
import express from "express";

const formidable = require("formidable");

export const formidableUpload = async (
  req: express.Request,
): Promise<FormiddableResponse> => {
  try {
    const form = new formidable.IncomingForm();

    const MAX_FILE_UPLOAD_BYTES = 50 * 1024 * 1024; // 50MB
    const MAX_FIELDS_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

    form.maxFileSize = MAX_FILE_UPLOAD_BYTES;
    form.maxFieldsSize = MAX_FIELDS_SIZE_BYTES;
    form.keepExtensions = true;
    form.multiples = false;

    const formfields: FormiddableResponse = await new Promise(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) return reject(new Error("Form Not parsed"));

          /** 🔹 Flatten fields */
          const cleanedFields: Record<string, any> = {};

          for (const key in fields) {
            const value = fields[key];
            cleanedFields[key] = Array.isArray(value) ? value[0] : value;
          }

          /** 🔹 Normalize files */
          const cleanedFiles: Record<string, any> = {};

          for (const key in files) {
            let file = files[key];

            if (Array.isArray(file)) {
              file = file[0];
            }

            cleanedFiles[key] = {
              filepath: file?.filepath || file?._writeStream?.path || null,
              newFilename: file?.newFilename || null,
              originalFilename: file?.originalFilename || null,
              mimetype: file?.mimetype || null,
              size: file?.size || null,
              hashAlgorithm: file?.hashAlgorithm || null,
            };
          }

          resolve({
            fields: cleanedFields,
            files: cleanedFiles,
          });
        });
      },
    );

    return { files: formfields.files, fields: formfields.fields };
  } catch (error) {
    console.error("Error in formidable upload:", error.message);
  }
};
