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
const student_events_1 = __importDefault(require("../students/student.events"));
const helper_1 = require("./helper");
var Commands;
(function (Commands) {
    Commands["add"] = "add";
    Commands["remove"] = "remove";
})(Commands || (Commands = {}));
const studentEvent = new student_events_1.default();
class EventHandler {
    constructor() {
        this.bonusPoint = 10;
        this.intervalTime = 10; //in minutes
        this.arrivalHour = 9; //a.m //in hours
    }
    calculateBonus(arrivalTime) {
        const arrivalDate = new Date(arrivalTime);
        const arrivalHour = arrivalDate.getHours();
        const arrivalMinute = arrivalDate.getMinutes();
        const arrivalTimeInMinutes = arrivalHour * 60 + arrivalMinute;
        const expectedArrivalTime = this.arrivalHour * 60;
        return arrivalTimeInMinutes < expectedArrivalTime - this.intervalTime
            ? this.bonusPoint
            : arrivalTimeInMinutes > expectedArrivalTime + this.bonusPoint
                ? -this.bonusPoint
                : 0;
    }
    computeStudentRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            //XREAD records
            const events = yield redis_1.default.sendCommand([
                "XREAD",
                "STREAMS",
                "student_stream",
                "0-0",
            ]);
            if (!events)
                return [];
            const [_, records] = events[0];
            let students = [];
            for (const record of records) {
                let [__, userData] = record;
                userData = (0, helper_1.convertArrayParametersToObject)(userData);
                switch (userData.command) {
                    case Commands.add:
                        students.push({
                            userId: userData.userId,
                            name: userData.name,
                            email: userData.email,
                            points: 0,
                        });
                        break;
                    case Commands.remove:
                        students = students.filter((student) => student.userId !== userData.userId);
                        break;
                }
            }
            return students;
        });
    }
    computeAttendanceHandler(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let points = 0;
            let daysLate = 0;
            const attendanceRecord = [];
            let daysEarly = 0;
            let shouldUpdate = false;
            //XACK ALL Attendance
            const events = yield redis_1.default.sendCommand([
                "XREAD",
                "STREAMS",
                "attendance_stream",
                "0-0",
            ]);
            if (events) {
                const [__, records] = events[0];
                for (const record of records) {
                    let [_, userData] = record;
                    userData = (0, helper_1.convertArrayParametersToObject)(userData);
                    if (userData.userId === userId) {
                        const bonus = this.calculateBonus(userData.arrivalTime);
                        points += bonus;
                        daysLate += Number(bonus === -this.bonusPoint);
                        daysEarly += Number(bonus === this.bonusPoint);
                        attendanceRecord.push({
                            arrivalTime: userData.arrivalTime,
                            pointsGotten: bonus,
                        });
                        shouldUpdate = true;
                    }
                }
            }
            return {
                points,
                daysEarly,
                daysLate,
                attendanceRecord,
                shouldUpdate,
            };
        });
    }
    studentHandler(record, addNew = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (addNew) {
                    yield studentEvent.processStudent(record);
                }
                const students = yield this.computeStudentRecord();
                yield studentEvent.updateStudents(students);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    attendanceHandler(record) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield this.computeAttendanceHandler(record.userId);
                yield studentEvent.updateStudent(record.userId, student);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new EventHandler();
