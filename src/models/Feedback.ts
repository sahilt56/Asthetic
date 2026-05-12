import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFeedback extends Document {
  name: string;
  country: string;
  email?: string;
  rating?: number;
  message: string;
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
  },
  email: {
    type: String,
    required: false,
    trim: true,
  },
  rating: {
    type: Number,
    required: false,
    min: 1,
    max: 5,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
