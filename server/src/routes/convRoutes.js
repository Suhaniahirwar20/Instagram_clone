import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import {
  getMessages,
  sendMessage,
  markMessagesSeen,
  createConversation,
} from "../controllers/convController.js";

const router = express.Router();

router.get("/:conversationId/messages", protect, getMessages);
router.post("/:conversationId/message", protect, sendMessage);
router.post("/", protect, createConversation);
router.put("/:conversationId/seen", protect, markMessagesSeen);

export default router;