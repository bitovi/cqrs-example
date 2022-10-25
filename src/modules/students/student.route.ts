import express from "express";
import eventHandler from "../app/eventHandler";
import studentController from "./student.controller";

const router = express.Router();

//GET
router.get("/", studentController.getStudents);
router.get("/student/:id", studentController.getStudent);


router.post("/student", studentController.addStudent);
router.delete("/student/:id", studentController.removeStudent);
router.post("/student/:id/take-attendance", studentController.takeAttendance);

export default router;
