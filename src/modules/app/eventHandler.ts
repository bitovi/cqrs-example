import client from "../../config/redis";
import studentEventHandler from "../students/student.events";
import { convertArrayParametersToObject } from "./helper";

enum Commands {
  add = "add",
  remove = "remove",
}

const studentEvent = new studentEventHandler();

class EventHandler {
  bonusPoint = 10;
  intervalTime = 10; //in minutes
  arrivalHour = 9; //a.m //in hours

  private calculateBonus(arrivalTime: string) {
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

  async computeStudentRecord() {
    //XREAD records
    const events: any = await client.sendCommand([
      "XREAD",
      "STREAMS",
      "student_stream",
      "0-0",
    ]);
    if (!events) return [];
    const [_, records] = events[0];
    let students: Array<any> = [];
    for (const record of records) {
      let [__, userData] = record;
      userData = convertArrayParametersToObject(userData);
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
          students = students.filter(
            (student) => student.userId !== userData.userId
          );
          break;
      }
    }
    return students;
  }

  async computeAttendanceHandler(userId: string) {
    let points: number = 0;
    let daysLate: number = 0;
    const attendanceRecord: any = [];
    let daysEarly: number = 0;
    let shouldUpdate: boolean = false;
    //XACK ALL Attendance
    const events: any = await client.sendCommand([
      "XREAD",
      "STREAMS",
      "attendance_stream",
      "0-0",
    ]);
    if (events) {
      const [__, records] = events[0];
        for (const record of records) {
          let [_, userData] = record;
          userData = convertArrayParametersToObject(userData);
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
  }

  async studentHandler(record: any, addNew: boolean = true) {
    try {
      if (addNew) {
        await studentEvent.processStudent(record);
      }
      const students = await this.computeStudentRecord();
      await studentEvent.updateStudents(students);
    } catch (error) {
      console.log(error);
    }
  }

  async attendanceHandler(record: any) {
    try {
      const student = await this.computeAttendanceHandler(record.userId);
      await studentEvent.updateStudent(record.userId, student);
    } catch (error) {
      console.log(error);
    }
  }
}

export default new EventHandler();
