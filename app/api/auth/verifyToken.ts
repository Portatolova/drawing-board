/**
 * CodeCollab - /api/auth/verifyToken.ts
 * Route for pages to POST to and verify user's stored Tokens.
 *
 * Note from Carl:
 * If validation fails in anyway, the token is deemed Invalid.
 * There should be no exceptions to this whatsoever.
 *
 * Maintainer: Carl Voller
 */

import express from "express";
import fs from "fs";
import jwt from 'jsonwebtoken';
import { User } from './models/user.model';

export function checkToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.headers.token) {
        req.body.token = req.headers.token
        next()
        return
    }
    if (req.query.token) {
        req.body.token = req.query.token
        next()
        return
    }
    next()
}

// Handles requests to /auth/verifyToken
function verifyToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    // Checks if token exists.
    if(!req.body.token) { return res.status(400).end(); }

    // Pass Token to Handler function.
    verify(req.body.token, (err: string, stat: boolean) => {
        if(err) { return res.status(403).end(err); }
        return res.json({ valid: stat }).end();
    });
}

// Middleware function to handle verifyToken requests on any route.
function vTFunc(req: express.Request, res: express.Response, next: express.NextFunction) {

    // Do not verify token if request is for uploadFile.
    if(req.headers['content-type'] && req.headers['content-type']!.split(" ").indexOf("multipart/form-data") > -1) { return next(); }
    
    // Checks if token exists.
    if(!req.body.token && !req.query.token) {
        // Token was not specified in request, pass request to main function.
        req.body.auth = { isAuthenticated: false };
        return next();
    } else {

        // Pass token to Handler function.
        verify(req.body.token || req.query.token, (err: string, stat: boolean, user: Object) => {
            if(err) { req.body.auth = { isAuthenticated: false, error: err }; return next(); }
            req.body.auth = {
                isAuthenticated: true,
                ui: user
            }
            return next();
        });
    }
}

// Handler Function for verifying tokens.
function verify(token: string, cb: Function) {
    // Verifies JWT token with server public key.
    jwt.verify(token, fs.readFileSync(__dirname + "/keys/public.key"), (err: any, data: any) => {

        // Standard error checking
        if(err) { return cb("Token Invalid."); }
        if(!data.id || !data.email) { return cb("Invalid Token."); }

        // Queries DB for a user with specified ID and specified Token stored.
        User.findOne({ _id: data.id, 'keys.token': token }).then((user) => {
            if(!user) { return cb("Invalid Token"); }

            // Check each individual stored token. Handle accordingly.
            for(let i = 0; i < user.keys.length; i++) {
                if(user.keys[i].token == token) {
                    let key = user.keys[i];

                    // Remove all tokens with undefined.
                    while(findWithAttr(user.keys, "token", undefined) > -1) {
                        user.keys.splice(findWithAttr(user.keys, "token", undefined), 1);
                    }

                    // @ts-ignore
                    // If current token is expired, remove all other expired token.
                    if(key.expiresOn < new Date().getTime()) {
                        return User.updateOne({ _id: String(user._id) }, { keys: user.keys }).then((u) => {
                            return cb("Invalid Token.");
                        }).catch((err) => {
                            console.error(err); return cb("An error occurred.");
                        });
                    }

                    i = findWithAttr(user.keys, "token", token);

                    // Update DB and return valid: true
                    return User.updateOne({ _id: String(user._id) }, { keys: user.keys }).then((u) => {
                        return cb(null, true, user);
                    }).catch((err) => {
                        console.error(err); return cb("An error occurred.");
                    });
                } else {
                    // @ts-ignore
                    // If current token isn't what what was specified, check validity of token. If expired, set value to undefined for removal.
                    if(user.keys[i] && user.keys[i].expiresOn < new Date().getTime()) { user.keys[i].token = undefined; }
                }
            }
        }).catch((err) => {
            console.error(err); return cb("Token Invalid.");
        });
    });
}

function findWithAttr(array: Array<any>, attr: string, value: any) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

export default verifyToken;
export const vT = vTFunc;
