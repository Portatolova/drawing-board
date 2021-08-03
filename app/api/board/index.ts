/**
 * Drawing Board - /api/board/index.ts
 * API router for drawing board requests.
 * 
 * Maintainer: Carl Voller
 */

import { Router } from 'express';
import { vT } from "../auth/verifyToken"
import createBoard from "./create/board";
import getBoards from "./get/boards";
import getPreview from "./get/preview";
import getCanvasId from './get/canvasId';
import download from "./get/download";

const router: Router = Router();

// Local Auth Routes
router.post("/create/board", vT, createBoard);
router.post("/get/boards", vT, getBoards);
router.post("/get/canvasId", vT, getCanvasId);

router.get("/get/preview", getPreview);
router.get("/get/download", download);

export default router;