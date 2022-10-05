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
const uuid_1 = require("uuid");
const redis_1 = __importDefault(require("../../config/redis"));
const helper_1 = require("../app/helper");
const eventHandler_1 = __importDefault(require("../app/eventHandler"));
const getStudent_1 = __importDefault(require("./models/getStudent"));
class StudentCommandHandler {
    generateUserId() {
        return (0, uuid_1.v4)();
    }
    isIdRecorded(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = (0, helper_1.getTodayFromDateTime)();
            console.log(key);
            let students = yield redis_1.default.get(key);
            if (!students) {
                yield redis_1.default.set(key, JSON.stringify([]));
                return false;
            }
            const studentArray = JSON.parse(students);
            const isInArray = studentArray.find((student) => student === userId);
            console.log(isInArray);
            return isInArray ? true : false;
        });
    }
    addStudent(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, name, gender } = payload;
            // double check from databasequery
            const student = yield getStudent_1.default.findOne({ email }).lean();
            if (student)
                throw new Error("Email already exists");
            const userId = this.generateUserId();
            const studentObj = {
                userId,
                email,
                name,
                gender,
                command: "add",
            };
            const parameters = (0, helper_1.convertObjectToParameters)(studentObj);
            yield redis_1.default.sendCommand(["XADD", "student_stream", "*", ...parameters]);
            //could have an event listener but to keep things simple.
            eventHandler_1.default.studentHandler(studentObj);
        });
    }
    removeStudent(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield getStudent_1.default.findOne({ userId }).lean();
            if (!student)
                throw new Error("Invalid userId provided");
            const studentObj = {
                userId,
                command: "remove",
            };
            const parameters = (0, helper_1.convertObjectToParameters)(studentObj);
            yield redis_1.default.sendCommand(["XADD", "student_stream", "*", ...parameters]);
            eventHandler_1.default.studentHandler(studentObj);
        });
    }
    takeAttendance(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield getStudent_1.default.findOne({ userId }).lean();
            if (!student)
                throw new Error("Invalid userId provided");
            const arrivalTime = new Date().toString();
            const attendanceTaken = yield this.isIdRecorded(userId);
            if (attendanceTaken)
                throw new Error("Already signed in for the day");
            const attendanceObj = {
                userId,
                arrivalTime,
            };
            const parameters = (0, helper_1.convertObjectToParameters)(attendanceObj);
            yield redis_1.default.sendCommand(["XADD", "attendance_stream", "*", ...parameters]);
            eventHandler_1.default.attendanceHandler(attendanceObj);
        });
    }
}
exports.default = new StudentCommandHandler();
