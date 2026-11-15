import express from "express";

const router = express.Router();

import { register, login, logout, me, getProfileByUsername } from "../controllers/authController.js";
import { protect } from "../middleware/authmiddleware.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout",protect, logout);
router.get("/me",protect, me);
router.get("/:username",protect,getProfileByUsername);

export default router;