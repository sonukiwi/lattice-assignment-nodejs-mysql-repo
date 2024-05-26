const { check } = require("express-validator");

const NAME_VALUE_ERROR_MESSAGE = "Name is required.";
const ADDRESS_VALUE_ERROR_MESSAGE =
  "Address should be at least 10 characters long.";
const EMAIL_VALUE_ERROR_MESSAGE = "Please provide a valid email.";
const PASSWORD_VALUE_ERROR_MESSAGE =
  "Password must contain one upper character, one lower character and a number. Max length 15 and min length 8.";
const PHONE_NUMBER_VALUE_ERROR_MESSAGE =
  "Please provide a valid phone number with country code.";

const registerPatientValidator = [
  check("name").notEmpty().withMessage(NAME_VALUE_ERROR_MESSAGE),
  check("address")
    .notEmpty()
    .bail()
    .isLength({ min: 10 })
    .withMessage(ADDRESS_VALUE_ERROR_MESSAGE),
  check("email").isEmail().withMessage(EMAIL_VALUE_ERROR_MESSAGE),
  check("password")
    .isLength({ min: 8, max: 15 })
    .bail()
    .matches(/[A-Z]/)
    .bail()
    .matches(/[a-z]/)
    .bail()
    .matches(/\d/)
    .withMessage(PASSWORD_VALUE_ERROR_MESSAGE),
  check("phone")
    .notEmpty()
    .bail()
    .isLength({ min: 12 })
    .bail()
    .matches(/^\+\d+$/)
    .withMessage(PHONE_NUMBER_VALUE_ERROR_MESSAGE),
];

module.exports = { registerPatientValidator };
