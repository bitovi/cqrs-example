import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance {
  arrivalTime: string;
  pointsGotten: number;
}

interface IStudentDocument extends Document {
  userId: string;
  name: string;
  email: string;
  gender: string;
  points: number;
  daysLate: number;
  daysEarly: number;
  attendanceRecord?: Array<IAttendance>;
}

const StudentSchema = new Schema<IStudentDocument>(
  {
    userId: String,
    name: String,
    email: String,
    gender: String,
    points: {
      type: Number,
      default: 0,
    },
    daysLate: {
      type: Number,
      default: 0,
    },
    daysEarly: {
      type: Number,
      default: 0,
    },
    attendanceRecord: [
      {
        _id: false,
        arrivalTime: String,
        pointsGotten: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IStudentDocument>("Student", StudentSchema);
