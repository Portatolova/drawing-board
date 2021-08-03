/**
 * Drawing Board - /api/index.ts
 * API router
 * 
 * Maintainer: Carl Voller
 */

import { Router } from 'express';
import auth from "./auth";
import board from "./board";
import feedback from "./feedback";

const router: Router = Router();

// Local Auth Routes
router.use("/auth", auth);
router.use("/board", board);
router.post("/postFeedback", feedback);

export default router;