/**
 * CodeCollab - /api/board/create/board.ts
 * POST routes to create a new drawing board.
 * 
 * Maintainer: Carl Voller
 */

import express from "express";
import mongodb from "mongodb";
import { Board } from "../models/board.model";
import { Canvas } from "../models/canvas.model";
import config from "../../../config.json";
import { Connection } from "../../../share";

async function createBoard(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.body.auth.isAuthenticated) { return res.status(403).end("Your token has expired. Try logging in again."); }
    if (!req.body.name) { return res.status(400).end("Please give your board a name."); }
    
    let existing = await Board.findOne({ 'owner.id': req.body.auth.ui._id, name: req.body.name });

    if(existing) { return res.status(409).end("You already own a board with that name"); }

    let board = new Board({
        name: req.body.name,
        owner: {
            id: req.body.auth.ui._id,
            username: req.body.auth.ui.username,
            email: req.body.auth.ui.email
        }, sharedWith: []
    });

    await board.save().catch((e) => { res.status(500).end(); console.error(e); });

    let canvas = new Canvas({
        boardID: board._id,
        pos: 0,
        data: ""
    });

    await canvas.save();

    let doc = Connection.get("canvas_sharedb", canvas._id);

    doc.create({
        boardID: board._id,
        background: "white",
        objects: []
    }, (err: any) => {
        if (err) { console.error(err); return res.status(500).end(); }
        return res.status(200).end()
    });

}

export default createBoard;
