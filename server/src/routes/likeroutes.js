import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { likePost, unlikePost } from "../controllers/likeController.js";

const router = express.Router();

router.post("/:id", protect, likePost);
router.delete("/:id", protect, unlikePost);

export default router;