/**
 * Drawing Board - feedback.model.ts
 * MongoDB schema for feedback data.
 * 
 * Note from Carl:
 * PLEASE TRY NOT TO CHANGE THIS AT ALL. I DONT WANT TO FIX MORE SHIT IF SOMETHING GOES WRONG.
 * 
 * Maintainer: Carl Voller
 */

import { Schema, model, Model, Document, Types } from 'mongoose';

export interface FeedbackModel extends Document {
    name: string;
    email: string;
    comment: string;
}

let feedbackSchema: Schema<FeedbackModel> = new Schema<FeedbackModel>({
    name: String,
    email: String,
    comment: String
});

export const Feedback: Model<FeedbackModel> = model<FeedbackModel>('feedback', feedbackSchema);