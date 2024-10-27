import { validationResult } from "express-validator";
import sendResponse from "../utils/sendResponse.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return sendResponse(res,"Received data is not valid",422, extractedErrors);
};