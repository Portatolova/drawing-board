/**
 * Drawing Board - /api/auth/logout.ts
 * Logs a user out.
 * 
 * Maintainer: Carl Voller
 */

import express from 'express';
import { User } from "./models/user.model";

function revokeToken(req: express.Request, res: express.Response, next: express.NextFunction) {

    let token = req.query.token || req.body.token;

    // Check if user is authenticated. (If user isn't, there are no tokens to return.)
    if (!req.body.auth.isAuthenticated) { return res.status(403).end("User is not authenticated."); }

    // Check if user specified which token to remove.
    if (!req.body.tokenID && !token) { return res.status(400).end("No token specified to be removed."); }

    if (req.body.tokenID) { token = ""; }

    let tokens = JSON.parse(JSON.stringify(req.body.auth.ui.keys));


    
    for (let i = 0; i < tokens.length; i++) {
        let key = tokens[i];
        if (key.token === token || String(key._id) === req.body.tokenID) {
            tokens.splice(i, 1);
            break;
        }
    }

    User.findByIdAndUpdate({ _id: req.body.auth.ui._id }, { keys: tokens }).then(() => {
        return res.redirect("/");
    }).catch((err) => { console.error(err); return res.status(500).end(); });

}

export default revokeToken;