import Joi from "joi";

export const addStudentValidator = (requestData: any): void => {
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
