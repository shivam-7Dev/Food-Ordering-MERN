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

const validateMyRestaurantRequest = [
  body("restaurantName")
    .isString()
    .notEmpty()
    .withMessage(" restaurant name must be string"),
  body("city").isString().notEmpty().withMessage(" city  must be string"),
  body("country").isString().notEmpty().withMessage(" country  must be string"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .notEmpty()
    .withMessage(" deliveryPrice must be Number"),
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .notEmpty()
    .withMessage(" estimatedDeliveryTime must be number"),
  body("cuisines")
    .isArray()
    .withMessage("cuisines must be array")
    .not()
    .isEmpty()
    .withMessage("cuisines array can not be empty"),
  body("menuItems")
    .isArray()
    .withMessage("cuisines must be array")
    .not()
    .isEmpty()
    .withMessage("cuisines array can not be empty"),
  body("menuItems.*.name")
    .isString()
    .notEmpty()
    .withMessage(" menuItems name is required and must be string"),
  body("menuItems.*.price")
    .isFloat({ min: 0 })
    .notEmpty()
    .withMessage(" menuItems price is required and must be number"),
  handleValidationErrors,
];

export { validateMyUserRequest, validateMyRestaurantRequest };
