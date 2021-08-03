/**
 * Drawing Board - canvas.ts
 * MongoDB schema for canvas data.
 * 
 * Note from Carl:
 * PLEASE TRY NOT TO CHANGE THIS AT ALL. I DONT WANT TO FIX MORE SHIT IF SOMETHING GOES WRONG.
 * 
 * Maintainer: Carl Voller
 */

import { Schema, model, Model, Document, Types } from 'mongoose';

export interface CanvasModel extends Document {
    pos: number;
    data: string;
    boardID: Types.ObjectId
}

let canvasSchema: Schema<CanvasModel> = new Schema<CanvasModel>({
    pos: Number,
    data: String,
    boardID: Types.ObjectId
});

export const Canvas: Model<CanvasModel> = model<CanvasModel>('canvas', canvasSchema);