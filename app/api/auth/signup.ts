/**
 * Drawing Board - /api/auth/signup.ts
 * Handles API signup requests
 * 
 * Maintainer: Carl Voller
 */

import express from 'express';
import { User, UserModel } from './models/user.model';
import jwt from 'jsonwebtoken';
import fs from "fs";

async function signup(req: express.Request, res: express.Response, next: express.NextFunction) {

    // Check if required parameters are set. Then obtain IP temporarily to determine country of origin.
    if(!req.body.u || !req.body.e || !req.body.p) { return res.status(400).end("One or more fields are blank."); }

    let { u, e, p } = req.body;

    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e)) {
        return res.status(400).end("Please enter a valid email address.");
    }

    let existing = await User.findOne({ email: e });

    if(existing) { return res.status(409).end("Email Address already taken."); }

    let user: UserModel = new User({
        username: u,
        email: e,
        keys: []
    });

    user.password = user.generateHash(p);

    let expiresOn = new Date().setDate(new Date().getDate() + 30);
    let token = jwt.sign({ id: user._id, email: user.email, expiresOn: expiresOn }, fs.readFileSync(__dirname + "/keys/private.key"), { algorithm: "RS256", expiresIn: "30d" });

    user.keys.push({
        token: token,
        expiresOn: expiresOn
    });

    try { user = await user.save(); } catch(err) { console.error(err); return res.status(500).end("An error occurred."); }

    return res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        token: token
    }).end();
}

export default signup;