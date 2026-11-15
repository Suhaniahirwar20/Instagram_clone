import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import {
  createPost,
  getPosts,
  getUserPosts,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", protect, createPost);
router.get("/user/:username", getUserPosts);

export default router;