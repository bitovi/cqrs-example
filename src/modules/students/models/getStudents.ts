import mongoose, { Schema, Document } from "mongoose";

export interface IStudent {
  userId: string;
  name: string;
  email: string;
}

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
