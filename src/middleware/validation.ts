import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};

const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name must be string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("addressLine1 must be string"),
  body("city").isString().notEmpty().withMessage("city must be string"),
  body("country").isString().notEmpty().withMessage("country must be string"),
  handleValidationErrors,
];

export { validateMyUserRequest };
