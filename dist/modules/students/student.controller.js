"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getStudents_1 = __importDefault(require("./models/getStudents"));
const getStudent_1 = __importDefault(require("./models/getStudent"));
const student_command_1 = __importDefault(require("./student.command"));
const student_validator_1 = require("./student.validator");
class StudentsController {
    /*
      |--------------------------------------------------------------------------
      | Students Controller
      |--------------------------------------------------------------------------
      |
      | This controller handles everything that has to do with Students route.
      |
      |
      */
    /**
     * @param {Request} req this is the request coming from the client
     * @param {Response} res this is the http response given back to the client
     */
    addStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body;
                (0, student_validator_1.addStudentValidator)(payload);
                yield student_command_1.default.addStudent(payload);
                res.json({
                    message: "Student successfully added",
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error === null || error === void 0 ? void 0 : error.message,
                });
            }
        });
    }
    /**
     * @param {Request} req this is the request coming from the client
     * @param {Response} res this is the http response given back to the client
     */
    removeStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield student_command_1.default.removeStudent(req.params.id);
                res.json({
                    message: "Student successfully removed",
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error === null || error === void 0 ? void 0 : error.message,
                });
            }
        });
    }
    /**
     * @param {Request} req this is the request coming from the client
     * @param {Response} res this is the http response given back to the client
     */
    takeAttendance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield student_command_1.default.takeAttendance(req.params.id);
                res.json({
                    message: "Attendance taken",
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error === null || error === void 0 ? void 0 : error.message,
                });
            }
        });
    }
    /**
     * @param {Request} req this is the request coming from the client
     * @param {Response} res this is the http response given back to the client
     */
    getStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const students = yield getStudents_1.default.find();
                return res.json({
                    data: students,
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error === null || error === void 0 ? void 0 : error.message,
                });
            }
        });
    }
    /**
     * @param {Request} req this is the request coming from the client
     * @param {Response} res this is the http response given back to the client
     */
    getStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //student
                const student = yield getStudent_1.default.findOne({ userId: req.params.id });
                return res.json({
                    data: student,
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error === null || error === void 0 ? void 0 : error.message,
                });
            }
        });
    }
}
exports.default = new StudentsController();
