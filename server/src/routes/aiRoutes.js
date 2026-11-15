import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { generateCaption, rewriteMessage } from "../controllers/aiController.js";

const router = express.Router();

router.post("/caption",protect,generateCaption);
router.post("/rewrite", protect, rewriteMessage);

export default router;