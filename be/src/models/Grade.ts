import mongoose, { Schema, Document } from 'mongoose';

export interface IGradeUpdate extends Document {
  studentCode: string;
  grades: { subject: string; score: number }[];
  comments?: string;
  teacherId: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const GradeUpdateSchema: Schema = new Schema({
  studentCode: { type: String, required: true },
  grades: [{
    subject: { type: String, required: true },
    score: { type: Number, required: true },
  }],
  comments: { type: String },
  teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IGradeUpdate>('GradeUpdate', GradeUpdateSchema);
