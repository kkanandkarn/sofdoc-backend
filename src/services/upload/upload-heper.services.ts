import {
  FileMeta,
  UploadedFile,
  GenerateFileName,
  FileType,
  FileMimeType,
  File,
  User,
} from "../../utils/interface";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import { throwError } from "../../utils/helper";
import { BAD_REQUEST, ErrorHandler } from "../../helper";
import { BASE_UPLOAD_FOLDER } from "../../utils/constant";

class UploadHelper {
  async getFileId(): Promise<string> {
    try {
      return uuidv4();
    } catch (e) {
      throwError(e);
    }
  }

  async generateFileName(
    originalFileName: string,
    fileId: string,
  ): Promise<GenerateFileName> {
    try {
      const extension = path.extname(originalFileName);
      const fileName = `${fileId}${extension}`;
      return { fileName, originalFileName };
    } catch (e) {
      throwError(e);
    }
  }

  async resolveFolderPath(user: User): Promise<string> {
    try {
      const { userType, userId, tenantId } = user;
      const folderpathMapper = {
        INDIVIDUAL: `/individual/${userId}`,
        ORGANISATION: `/organisation/${tenantId}`,
      };
      return folderpathMapper[userType];
    } catch (e) {
      throwError(e);
    }
  }
  async extractFileMeta(file: File): Promise<FileMeta> {
    try {
      if (!file) return null;

      const mimetype: FileMimeType = file.mimetype;

      const filename: string = file.originalFilename || file.newFilename || "";
      const extension: string | null = filename.includes(".")
        ? (filename.split(".").pop()?.toLowerCase() ?? null)
        : null;

      let fileType: FileType = await this.getFileType(mimetype);

      const size: number = file.size ?? 0;
      const sizeInMb = `${(size / (1024 * 1024)).toFixed(2)} MB`;

      return {
        mimetype,
        fileType,
        extension,
        size,
        sizeInMb,
      };
    } catch (e) {
      throwError(e);
    }
  }

  async getFileType(mimeType: FileMimeType): Promise<FileType> {
    try {
      if (mimeType.startsWith("image/")) {
        return "image";
      }
      const mimeTypeMapper = {
        "application/pdf": "pdf",
        "application/msword": "document",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "document",
        "application/vnd.ms-excel": "spreadsheet",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          "spreadsheet",
        "application/vnd.ms-powerpoint": "presentation",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation":
          "presentation",
      };
      return mimeTypeMapper[mimeType];
    } catch (e) {
      throwError(e);
    }
  }
}
export default UploadHelper;
