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
const express_1 = __importDefault(require("express"));
const eventHandler_1 = __importDefault(require("../app/eventHandler"));
const student_controller_1 = __importDefault(require("./student.controller"));
const router = express_1.default.Router();
//GET
router.get("/", student_controller_1.default.getStudents);
router.get("/student/:id", student_controller_1.default.getStudent);
router.post("/student", student_controller_1.default.addStudent);
router.delete("/student/:id", student_controller_1.default.removeStudent);
router.post("/student/:id/take-attendance", student_controller_1.default.takeAttendance);
//ADMIN-ENDPOINTS-THAT-RECOMPUTE
router.post("/student/:id/re-compute", (req, res) => {
    eventHandler_1.default.attendanceHandler({ userId: req.params.id });
    res.json({
        message: "User data recomputed",
    });
});
router.post("/re-compute", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    eventHandler_1.default.studentHandler({}, false);
    res.json({
        message: "User data recomputed",
    });
}));
exports.default = router;
