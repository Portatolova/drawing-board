/**
 * CodeCollab - /api/auth/name.ts
 * Randomly generate a name
 * 
 * Maintainer: Carl Voller
 */

 import express from 'express';
 import { firtnames, lastnames } from "./names.json";
 
 function name(req: express.Request, res: express.Response, next: express.NextFunction) {
 
     let fname = firtnames[Math.floor(Math.random() * (1000 - 0 + 1) + 0)],
         lname = lastnames[Math.floor(Math.random() * (1000 - 0 + 1) + 0)];
 
     // Return token information to user.
     return res.json({ name: `${fname} ${lname}`}).end();
 
 }
 
 export default name;