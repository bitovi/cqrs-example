import client from "../../config/redis";
import { getTodayFromDateTime } from "../app/helper";
import getStudentModel from "./models/getStudent";
import getStudentsModel from "./models/getStudents";

enum Commands {
  add = "add",
  remove = "remove",
  attendance = "take-attendance",
}

class studentEventHandler {
  private async updateDailyRecord(userId: string) {
    const today = getTodayFromDateTime();
    const studentsToday = await client.get(today);
    if (studentsToday) {
      const studentsArray = JSON.parse(studentsToday);
      studentsArray.push(userId);
      await client.set(today, JSON.stringify(studentsArray));
    }
  }

  async processStudent(record: any) {
    switch (record.command) {
      case Commands.add:
        await new getStudentModel({
          userId: record.userId,
          name: record.name,
          email: record.email,
          gender: record.gender,
        }).save();
        break;
      case Commands.remove:
        await getStudentModel.deleteOne({ userId: record.userId });
        break;
    }
  }

  async updateStudent(userId: string, studentData: any) {
    await getStudentModel.updateOne(
      {
        userId,
      },
      { ...studentData }
    );
    await this.updateDailyRecord(userId);
  }

  async updateStudents(students: any) {
    const allStudents = await getStudentsModel.findOne({});
    if (allStudents) {
      allStudents.students = students;
      allStudents.noOfStudents = students.length;
      await allStudents.save();
    } else {
      await new getStudentsModel({
        students,
        noOfStudents: students.length,
      }).save();
    }
  }
}

export default studentEventHandler;
