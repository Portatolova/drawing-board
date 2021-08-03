/**
 * Drawing Board - board.ts
 * MongoDB schema for board
 * 
 * Note from Carl:
 * PLEASE TRY NOT TO CHANGE THIS AT ALL. I DONT WANT TO FIX MORE SHIT IF SOMETHING GOES WRONG.
 * 
 * Maintainer: Carl Voller
 */

import { Schema, model, Model, Document, Types } from 'mongoose';

export interface BoardModel extends Document {
    name: string;
    owner: {
        id: Types.ObjectId;
        username: string;
        email: string;
    }, sharedWith: Array<{
        id: Types.ObjectId,
        username: string;
        email: string;
    }>
}

let boardSchema: Schema<BoardModel> = new Schema<BoardModel>({
    name: String,
    owner: {
        id: Types.ObjectId,
        username: String,
        email: String
    }, sharedWith: [{
        id: Types.ObjectId,
        username: String,
        email: String
    }]
});

export const Board: Model<BoardModel> = model<BoardModel>('board', boardSchema);