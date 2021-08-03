/**
 * Drawing Board - /api/feedback.ts
 * POST route to get user feedback
 * 
 * Maintainer: Carl Voller
 */

import express from "express";

import { Feedback } from "./feedback.model";

const missingParam = `
<!DOCTYPE html>
<html>
    <body>
        <p>Please ensure that all fields are filled before submitting this form.</p>
        <a href="/faq#feedback">Go back to the FAQ page</a>
    </body>
</html>
`

const success = `
<!DOCTYPE html>
<html>
    <body>
        <p>You submitted this feedback: </p>
        <p>Your name is {}</p>
        <p>Your email is {}</p>
        <p>Your feedback is {}</p>
        <a href="/faq#feedback">Go back to the FAQ page</a>
    </body>
</html>
`

async function feedback(req: express.Request, res: express.Response, next: express.NextFunction) {

    if (!req.body.name || !req.body.email || !req.body.comment) { return res.status(400).end(missingParam); }

    const { name, email, comment } = req.body;

    let f = new Feedback({ name, email, comment });

    await f.save();

    return res.status(200).end(success.replace("{}", name).replace("{}", email).replace("{}", comment));
    
}

export default feedback;
