import { UploadResponse, File, User, UrlMapper } from "../../utils/interface";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import { getFile, throwError } from "../../utils/helper";
import { BAD_REQUEST, ErrorHandler } from "../../helper";
import { cloudinaryUploader } from "../../config";
import UploadHelper from "./upload-heper.services";
import { prisma } from "../../../lib/prisma";
import { BASE_UPLOAD_FOLDER, SUCCESS } from "../../utils/constant";

class Upload {
  async cloudinaryUpload(
    body: any,
    files: any,
    key: string = "document",
    user: User,
    db: any = prisma,
  ): Promise<UploadResponse> {
    try {
      const fileId: string = await new UploadHelper().getFileId();
      const file: File = await getFile(files, key);

      const { fileName, originalFileName } =
        await new UploadHelper().generateFileName(
          file.originalFilename,
          fileId,
        );

      const folderPath = await new UploadHelper().resolveFolderPath(user);

      const uploadResult = await cloudinaryUploader.uploader.upload(
        file.filepath,
        {
          folder: `${BASE_UPLOAD_FOLDER}/${folderPath}`,
          public_id: path.parse(fileName).name,
          resource_type: "auto",
        },
      );
      const url = uploadResult.secure_url;
      const mapUrl = `${process.env.BASEURL}/cdn/${folderPath}/${fileName}`;

      const fileMetaData = await new UploadHelper().extractFileMeta(file);

      await this.addUrlMapper(
        {
          fileId: fileId,
          originalUrl: url,
          mapUrl,
          fileName,
          fileSize: fileMetaData.sizeInMb,
          fileType: fileMetaData.fileType,
          originalFileName,
          mimeType: fileMetaData.mimetype,
          originalFileSize: fileMetaData.size,
        },
        user,
        db,
      );

      return {
        fileName,
        originalFileName,
        url,
      };
    } catch (error) {
      throwError(error);
    }
  }
  async addUrlMapper(body: UrlMapper, user: User, db = prisma) {
    try {
      await db.urlMapper.create({
        data: {
          fileId: body.fileId,
          originalUrl: body.originalUrl,
          mapUrl: body.mapUrl,
          fileName: body.fileName,
          fileSize: body.fileSize,
          fileType: body.fileType,
          originalFileName: body.originalFileName,
          originalFileSize: String(body.originalFileSize),
          mimeType: body.mimeType,
          ...(user.userId && {
            users: { connect: { id: user.userId } },
          }),
          ...(user.roleId && {
            roles: { connect: { id: user.roleId } },
          }),
          ...(user.tenantId && {
            tenants: { connect: { id: user.tenantId } },
          }),
          createdBy: user.userId,
          updatedBy: user.userId,
        },
      });

      return { message: SUCCESS };
    } catch (e) {
      throwError(e);
    }
  }
}

export default Upload;
