/**
 * Drawing Board - /api/auth/login.ts
 * Handles API login requests
 * 
 * Maintainer: Carl Voller
 */

import express from 'express';
import { User } from './models/user.model';
import jwt from 'jsonwebtoken';
import fs from 'fs';

async function login(req: express.Request, res: express.Response, next: express.NextFunction) {

    // Check if required parameters are set. Then obtain IP temporarily to determine country of origin.
    if(!req.body || !req.body.e || !req.body.p) { return res.status(400).end("One or more fields are blank."); }

    let { e, p } = req.body;

    let user = await User.findOne({ email: e });

    if (!user) { return res.status(400).end("Your email or password is incorrect."); }
    if (!user.validatePass(p)) { return res.status(400).end("Your email or password is incorrect."); }

    let expiresOn = new Date().setDate(new Date().getDate() + 30);
    let token = jwt.sign({ id: user._id, email: user.email, expiresOn: expiresOn }, fs.readFileSync(__dirname + "/keys/private.key"), { algorithm: "RS256", expiresIn: "30d" });
    
    try { await User.updateOne({ email: e }, { $push: { keys: { expiresOn, token } } }); } catch(err) { console.error(err); return res.status(500).end("An error occurred."); }

    return res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        token: token
    }).end();
}

export default login;