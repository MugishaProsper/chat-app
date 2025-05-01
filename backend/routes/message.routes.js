import express from "express";
import { getMessages, sendMessage, markAsRead } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/read/:conversationId", protectRoute, markAsRead);

export default router;
