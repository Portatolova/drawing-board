/**
 * CodeCollab - /api/board/get/boards.ts
 * POST routes to create a new drawing board.
 * 
 * Maintainer: Carl Voller
 */

 import express from "express";
 import { Canvas, CanvasModel } from "../models/canvas.model";
 
 async function getCanvasId(req: express.Request, res: express.Response, next: express.NextFunction) {
     //f (!req.body.auth.isAuthenticated) { return res.status(403).end("Your token has expired. Try logging in again."); }
 
     let canvas: any = await Canvas.findOne({ 'boardID': req.body.boardID, pos: req.body.pos*1 });
     //boards = boards.map((b: CanvasModel) => ({ id: b._id, owner: b.owner, sharedWith: b.sharedWith, name: b.name }));
     return res.json({ id: canvas._id }).end();
 }
 
 export default getCanvasId;
 