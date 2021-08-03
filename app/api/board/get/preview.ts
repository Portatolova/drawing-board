/**
 * Drawing Board - /api/board/get/preview.ts
 * POST routes to create a new drawing board.
 * 
 * Maintainer: Carl Voller
 */

import express from "express";
import convertJSONToPNG from "../canvas";
import { Board, BoardModel } from "../models/board.model";
import { Canvas } from "../models/canvas.model";
import { Connection } from "../../../share";

async function getPreview(canvasId: string) {
    let doc = Connection.get("canvas_sharedb", String(canvasId));

    let preview = () => new Promise<string>((resolve, reject) => {
        doc.fetch((err) => {
            resolve(err ? "" : convertJSONToPNG(doc.data));
        });
    });

    return (await preview());
}

async function preview(req: express.Request, res: express.Response, next: express.NextFunction) {

    if (!req.query.boardID || !req.query.pos) { return res.status(400).end() }

    let { boardID, pos }: any = req.query;

    let canvas = await Canvas.findOne({ boardID, pos });

    if (!canvas) { return res.status(404).end(); }

    let png = (await getPreview(canvas._id)).replace(/^data:image\/png;base64,/, "");

    let img = Buffer.from(png, 'base64');

    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });

    return res.end(img);
}

export default preview;
