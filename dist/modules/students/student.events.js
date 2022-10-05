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
const redis_1 = __importDefault(require("../../config/redis"));
const helper_1 = require("../app/helper");
const getStudent_1 = __importDefault(require("./models/getStudent"));
const getStudents_1 = __importDefault(require("./models/getStudents"));
var Commands;
(function (Commands) {
    Commands["add"] = "add";
    Commands["remove"] = "remove";
    Commands["attendance"] = "take-attendance";
})(Commands || (Commands = {}));
class studentEventHandler {
    updateDailyRecord(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = (0, helper_1.getTodayFromDateTime)();
            const studentsToday = yield redis_1.default.get(today);
            if (studentsToday) {
                const studentsArray = JSON.parse(studentsToday);
                studentsArray.push(userId);
                yield redis_1.default.set(today, JSON.stringify(studentsArray));
            }
        });
    }
    processStudent(record) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (record.command) {
                case Commands.add:
                    yield new getStudent_1.default({
                        userId: record.userId,
                        name: record.name,
                        email: record.email,
                        gender: record.gender,
                    }).save();
                    break;
                case Commands.remove:
                    yield getStudent_1.default.deleteOne({ userId: record.userId });
                    break;
            }
        });
    }
    updateStudent(userId, studentData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield getStudent_1.default.updateOne({
                userId,
            }, Object.assign({}, studentData));
            yield this.updateDailyRecord(userId);
        });
    }
    updateStudents(students) {
        return __awaiter(this, void 0, void 0, function* () {
            const allStudents = yield getStudents_1.default.findOne({});
            if (allStudents) {
                allStudents.students = students;
                allStudents.noOfStudents = students.length;
                yield allStudents.save();
            }
            else {
                yield new getStudents_1.default({
                    students,
                    noOfStudents: students.length,
                }).save();
            }
        });
    }
}
exports.default = studentEventHandler;
