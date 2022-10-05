import { v4 as uuid } from "uuid";
import client from "../../config/redis";
import { convertObjectToParameters, getTodayFromDateTime } from "../app/helper";
import eventHandler from "../app/eventHandler";
import getStudentModel from "./models/getStudent";

class StudentCommandHandler {
  private generateUserId() {
    return uuid();
  }

  private async isIdRecorded(userId: string) {
    const key = getTodayFromDateTime();
    let students = await client.get(key);
    if (!students) {
      await client.set(key, JSON.stringify([]));
      return false;
    }
    const studentArray = JSON.parse(students);
    const isInArray = studentArray.find(
      (student: string) => student === userId
    );
    return isInArray ? true : false;
  }

  async addStudent(payload: any) {
    const { email, name, gender } = payload;
    // double check from databasequery
    const student = await getStudentModel.findOne({ email }).lean();
    if (student) throw new Error("Email already exists");
    const userId = this.generateUserId();
    const studentObj = {
      userId,
      email,
      name,
      gender,
      command: "add",
    };
    const parameters = convertObjectToParameters(studentObj);
    await client.sendCommand(["XADD", "student_stream", "*", ...parameters]);
    //could have an event listener but to keep things simple.
    eventHandler.studentHandler(studentObj);
  }

  async removeStudent(userId: string) {
    const student = await getStudentModel.findOne({ userId }).lean();
    if (!student) throw new Error("Invalid userId provided");
    const studentObj = {
      userId,
      command: "remove",
    };
    const parameters = convertObjectToParameters(studentObj);
    await client.sendCommand(["XADD", "student_stream", "*", ...parameters]);
    eventHandler.studentHandler(studentObj);
  }

  async takeAttendance(userId: string) {
    const student = await getStudentModel.findOne({ userId }).lean();
    if (!student) throw new Error("Invalid userId provided");
    const arrivalTime = new Date().toString();
    const attendanceTaken = await this.isIdRecorded(userId);
    if (attendanceTaken) throw new Error("Already signed in for the day");
    const attendanceObj = {
      userId,
      arrivalTime,
    };
    const parameters = convertObjectToParameters(attendanceObj);
    await client.sendCommand(["XADD", "attendance_stream", "*", ...parameters]);
    eventHandler.attendanceHandler(attendanceObj);
  }
}

export default new StudentCommandHandler();
