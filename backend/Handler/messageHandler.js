import express from 'express';
import {protectRoute} from "../middleware/protectRoute.js"
import {sendMessage, getMessages} from "../controller/message.controller.js";

const router = express.Router();

router.post("/send/:id", protectRoute, sendMessage);
router.get("/:id", protectRoute, getMessages);

export default router;