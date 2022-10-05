import { Request, Response } from "express";
import getStudentsModel from "./models/getStudents";
import getStudentModel from "./models/getStudent";
import studentCommandHandler from "./student.command";
import { addStudentValidator } from "./student.validator";

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
  async addStudent(req: Request, res: Response) {
    try {
      const payload = req.body;
      addStudentValidator(payload);
      await studentCommandHandler.addStudent(payload);
      res.json({
        message: "Student successfully added",
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        error: error?.message,
      });
    }
  }

  /**
   * @param {Request} req this is the request coming from the client
   * @param {Response} res this is the http response given back to the client
   */
  async removeStudent(req: Request, res: Response) {
    try {
      await studentCommandHandler.removeStudent(req.params.id);
      res.json({
        message: "Student successfully removed",
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        error: error?.message,
      });
    }
  }

  /**
   * @param {Request} req this is the request coming from the client
   * @param {Response} res this is the http response given back to the client
   */
  async takeAttendance(req: Request, res: Response) {
    try {
      await studentCommandHandler.takeAttendance(req.params.id);
      res.json({
        message: "Attendance taken",
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        error: error?.message,
      });
    }
  }

  /**
   * @param {Request} req this is the request coming from the client
   * @param {Response} res this is the http response given back to the client
   */
  async getStudents(req: Request, res: Response) {
    try {
      const students = await getStudentsModel.find();
      return res.json({
        data: students,
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        error: error?.message,
      });
    }
  }

  /**
   * @param {Request} req this is the request coming from the client
   * @param {Response} res this is the http response given back to the client
   */
  async getStudent(req: Request, res: Response) {
    try {
      //student
      const student = await getStudentModel.findOne({ userId: req.params.id });
      return res.json({
        data: student,
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        error: error?.message,
      });
    }
  }
}

export default new StudentsController();
