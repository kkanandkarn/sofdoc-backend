export const SERVER_ERROR_MESSAGE =
  "Internal Server Error. Please check the request or try again later.";
export const SUCCESS = "success";
export const FAILURE = "failure";

export const STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  HOLD: "HOLD",
  SUSPENDED: "SUSPENDED",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED",
};

export const BASE_UPLOAD_FOLDER = "sofdoc";
export const ALLOWED_MIME_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp"],
  pdf: ["application/pdf"],
  all: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
};

export const FRONTEND_ROUTES = {
  verifyLink: "/verify/",
};
