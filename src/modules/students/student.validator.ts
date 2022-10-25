import Joi from "joi";
import { AddStudentDTO } from "./student.types";

export const addStudentValidator = (requestData: AddStudentDTO): void => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    gender: Joi.string().required().valid("male", "female"),
  });
  const isValidateResult: Joi.ValidationResult = schema.validate(requestData);
  if (isValidateResult?.error) {
    throw new Error(`${isValidateResult.error?.message}`);
  }
};
