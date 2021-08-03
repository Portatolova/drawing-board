/**
 * Drawing Board - /api/auth/index.ts
 * API router for all authentication requests
 * 
 * Maintainer: Carl Voller
 */

import { Router } from 'express';
import signup from './signup';
import login from './login';
import logout from "./logout";
import verifyToken, { vT } from "./verifyToken";

const router: Router = Router();

// Local Auth Routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", vT, logout);

router.post("/verifyToken", verifyToken);

export default router;