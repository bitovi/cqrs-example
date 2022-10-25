import { number } from "joi";
import mongoose, { Schema, Document } from "mongoose";
import { IStudent } from "../student.types";

interface IGetStudentsDocument extends Document {
  students: Array<IStudent>;
  noOfStudents: number;
}

const GetStudentsSchema = new Schema<IGetStudentsDocument>(
  {
    noOfStudents: Number,
    students: [
      {
        _id: false,
        userId: String,
        name: String,
        email: String,
        points: number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IGetStudentsDocument>(
  "AllStudents",
  GetStudentsSchema
);
