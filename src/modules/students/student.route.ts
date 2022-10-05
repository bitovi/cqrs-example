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

//ADMIN-ENDPOINTS-THAT-RECOMPUTE
router.post("/student/:id/re-compute", (req, res) => {
  eventHandler.attendanceHandler({ userId: req.params.id });
  res.json({
    message: "User data recomputed",
  });
});
router.post("/re-compute", async (req, res) => {
  eventHandler.studentHandler({}, false);
  res.json({
    message: "User data recomputed",
  });
});

export default router;
