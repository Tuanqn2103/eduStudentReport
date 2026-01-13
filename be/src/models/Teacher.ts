import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  phone: string;
  name: string;
}

const TeacherSchema: Schema = new Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

export default mongoose.model<ITeacher>('Teacher', TeacherSchema);
