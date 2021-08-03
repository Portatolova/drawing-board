/**
 * Drawing Board - /app/io.ts
 * Handles socket.io connections
 *
 * Maintainer: Carl Voller
 */

import { Server, Socket } from "socket.io";
import { Canvas, CanvasModel } from "./api/board/models/canvas.model";
import { Connection, Mongo } from "./share";
import convertJSONToPNG from "./api/board/canvas";

let io: Server;

async function handleEvents(socket: Socket, id: string, io: Server) {

    let currentCanvasCount = 0;

    async function getPreview(canvasId: string) {
        let doc = Connection.get("canvas_sharedb", String(canvasId));

        let preview = () => new Promise<string>((resolve, reject) => {
            doc.fetch((err) => {
                resolve(err ? "" : convertJSONToPNG(doc.data));
            });
        });

        return (await preview());
    }

    socket.emit('previews', await (async () => {
        let all: any = await Canvas.find({ boardID: id });

        all = all.map(async (c: CanvasModel) => { return { pos: c.pos, img: await getPreview(c._id) } });

        all = await Promise.all(all);

        currentCanvasCount = all.length;

        return { type: 0, all }
    })());

    // Attach Events
    socket.on('draw', async (p) => {
        let canvas = await Canvas.findOne({ pos: p, boardID: id });
        let preview = await getPreview(canvas._id);
        io.to(id).emit("previews", { type: 1, pos: p, img: preview });
    });
    socket.on('signal', (d) => io.to(id).emit('signal', d));
    socket.on('cursor', c => socket.broadcast.emit("cursor", c));
    socket.on('disconnect', () => io.to(id).emit("userdc", socket.id));

    // Get board
    socket.on('getBoard', async (p) => {
        socket.emit('draw', ({ ...JSON.parse((await Canvas.findOne({ pos: p, boardID: id }))?.data || "{}"), pos: p }));
    });

    // Create board
    socket.on('addBoard', async () => {
        let canvas = new Canvas({
            pos: currentCanvasCount,
            data: "",
            boardID: id
        });
        await canvas.save();

        let doc = Connection.get("canvas_sharedb", canvas._id);

        doc.create({
            boardID: id,
            background: "white",
            objects: []
        }, (err: any) => {});
        io.to(id).emit("previews", { type: 2, pos: currentCanvasCount, img: "" });
        currentCanvasCount += 1;
    });

    // Delete Board
    socket.on('delBoard', async (p) => {
        let canvas = await Canvas.findOne({ boardID: id, pos: p });
        if (!canvas) { return; }
        let canvasId = canvas?._id;
        canvas?.delete();
        await Canvas.updateMany({ boardID: id, pos: { $gt: p } }, { $inc: { pos: -1 } });
        io.to(id).emit('previews', await (async () => {
            let all: any = await Canvas.find({ boardID: id });
            all = all.map(async (c: CanvasModel) => { return { pos: c.pos, img: await getPreview(c._id) } });
            all = await Promise.all(all);
            currentCanvasCount = all.length;
            return { type: 0, all }
        })());
        const Connection = Mongo().db("drawingboard");

        const opCol = Connection.collection(`o_canvas_sharedb`);
        const projCol = Connection.collection(`canvas_sharedb`);

        try { projCol.deleteOne({ _id: canvasId }); } catch (e) { console.error(e); }
        try { opCol.deleteMany({ d: canvasId }); } catch (e) { console.error(e); }
    });
    io.to(id).emit('ids', Array.from(io.sockets.adapter.rooms.get(id)!))
}

export function getIO() { return io; }

export function IO(app: any) {
    io = new Server(app, { path: '/run' });

    io.sockets.on("connection", (socket: Socket) => {
        let id = socket.handshake.query.id;
        if(!id) { return socket.disconnect(); }
        id = typeof id === "string" ? id : id[0]
        socket.join(id);
        handleEvents(socket, id, io);
    });
}