/**
 * Drawing Board - index.ts
 * A realtime collaborative drawing board.
 *
 * Some Guidelines for the code your about to jump into:
 * - Please read the comments. Do not touch anything ESPECIALLY if the file tells you not to.
 *
 * Created by Carl Ian Voller.
 * Copyright © 2021 Carl Ian Voller. All rights reserved.
 */

// Import Libraries
import express from "express";
import proxy from "express-http-proxy";
import https from "https";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { Server } from "ws";
import url from "url";
import cors from "cors";
import api from "./api";
import config from "./config.json";
import { IO } from "./io";
import { Connect } from "./share";

const app: express.Application = express();
const HTTPS: Number = 8443;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api", api);
app.use(cors({ origin: ["*"] }))

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../static/build")));
  app.use("/*", (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, "../static/build/index.html"));
  });
} else {
  app.use("/", proxy("localhost:3000"));
}  

// DB Connection
mongoose.connect(config.mongoose_uri, { useNewUrlParser: true });
export const DB = mongoose.connection;

// Create SSL Server
const httpsServer: https.Server = https.createServer(
  {
    passphrase: "Th1s1sv3rys3cr3t1v3",
    key: fs.readFileSync(`${__dirname}/SSL/key.pem`),
    cert: fs.readFileSync(`${__dirname}/SSL/cert.pem`)
  },
  app
);

// Listen on PORT
httpsServer.listen(HTTPS, () =>
  console.log(`HTTPS API listening on port ${HTTPS}`)
);

IO(httpsServer);

const wss: Server = new Server({ noServer: true });
httpsServer.on("upgrade", (req, sock, head) => { 
    if (url.parse(req.url).pathname === "/sh") {
        wss.handleUpgrade(req, sock, head, ws => wss.emit("connection", ws, req));
    }
});
Connect(wss);

// Export App for Unit Testing.
export default app;
