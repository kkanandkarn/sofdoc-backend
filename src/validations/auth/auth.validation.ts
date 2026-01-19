import * as Joi from "joi";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()[\]{}#^<>.,;:'"`~\\|/_+=-]).{6,30}$/;

const authSchema = {
  auth_login_post: Joi.object({
    username: Joi.string().trim().required().messages({
      "string.base": "Username should be a type of text",
      "any.required": "Username is required",
      "string.empty": "Username is required",
    }),
    password: Joi.string().trim().min(6).max(30).required().messages({
      "string.base": "Password should be a type of text",
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password must not exceed 30 characters",
      "any.required": "Password is required",
      "string.empty": "Password is required",
    }),
  }),
  registerUser: Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
      "string.base": "Name should be a type of text",
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),

    email: Joi.string().trim().email().required().messages({
      "string.base": "Email should be a type of text",
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

    username: Joi.string().trim().min(3).max(30).required().messages({
      "string.base": "Username should be a type of text",
      "string.empty": "Username is required",
      "any.required": "Username is required",
    }),
  }),
  auth_link_details_post: Joi.object({
    linkId: Joi.string().uuid({ version: "uuidv4" }).required().messages({
      "string.base": "Link ID should be a string",
      "string.guid": "Invalid link Id",
      "any.required": "Link ID is required",
      "string.empty": "Link ID is required",
    }),
  }),
  auth_resend_registration_request_post: Joi.object({
    email: Joi.string().trim().email().required().messages({
      "string.base": "Email should be a type of text",
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
  }),
};

export default authSchema;
