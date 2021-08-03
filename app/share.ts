/**
 * CodeCollab - /app/share.ts
 * Handles the editor's websocket connections.
 * 
 * Maintainer: Carl Voller
 */

import ShareDB from "sharedb";
import mongodb, { MongoClient } from "mongodb";
import config from "./config.json";
import { Server } from "ws";

let WebSocketJSONStream = require("websocket-json-stream");
let DB = require("sharedb-mongo")(config.mongoose_uri);

let connectMongo = (uri: string) => new Promise<MongoClient>((resolve, reject) => { mongodb.connect(uri, (err, client) => { err ? reject(err) : resolve(client); }); });

let mongo: MongoClient;
(async () => mongo = await connectMongo(config.mongoose_uri))();

let shareConfig = {
    db: DB
}

const share = new ShareDB(shareConfig);
export const Backend = share;
export const Connection = share.connect();
export const Mongo = () => { return mongo; }

export const Connect = (wss: Server) => {
     // Attach event listeners to WebSocketServer
     wss.on('connection', (ws, req) => {

        // Convert connection to stream and attach to shareDB.
        let stream = new WebSocketJSONStream(ws);

        share.listen(stream);

        ws.on('error', (error) => console.error(error));

    });
}
