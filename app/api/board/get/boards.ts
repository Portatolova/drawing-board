/**
 * CodeCollab - /api/board/get/boards.ts
 * POST routes to create a new drawing board.
 * 
 * Maintainer: Carl Voller
 */

import express from "express";
import { Board, BoardModel } from "../models/board.model";

async function getBoards(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.body.auth.isAuthenticated) { return res.status(403).end("Your token has expired. Try logging in again."); }

    let boards: any = await Board.find({ 'owner.id': req.body.auth.ui._id });
    boards = boards.map((b: BoardModel) => ({ id: b._id, owner: b.owner, sharedWith: b.sharedWith, name: b.name }));
    return res.json(boards).end();
}

export default getBoards;
