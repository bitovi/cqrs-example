"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStudentValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const addStudentValidator = (requestData) => {
    var _a;
    const schema = joi_1.default.object().keys({
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        gender: joi_1.default.string().required().valid("male", "female"),
    });
    const isValidateResult = schema.validate(requestData);
    if (isValidateResult === null || isValidateResult === void 0 ? void 0 : isValidateResult.error) {
        throw new Error(`${(_a = isValidateResult.error) === null || _a === void 0 ? void 0 : _a.message}`);
    }
};
exports.addStudentValidator = addStudentValidator;
