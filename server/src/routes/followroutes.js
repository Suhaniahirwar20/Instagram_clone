import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import {
  followUser,
  getFollowingUsers,
  unfollowUser,
} from "../controllers/followController.js";

const router = express.Router();

router.post("/:id", protect, followUser);
router.delete("/:id", protect, unfollowUser);
router.get("/following", protect, getFollowingUsers);

export default router;
