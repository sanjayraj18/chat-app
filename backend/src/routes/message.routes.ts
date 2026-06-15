import { Router } from "express";
import {
  getChatList,
  getDirectMessage,
  sendDirectMessage,
  sendGroupMessage,
} from "../controllers/message.controller";

const messageRoutes = Router();

messageRoutes.get("/", getDirectMessage);

messageRoutes.get("/list", getChatList);

messageRoutes.post("/direct", sendDirectMessage);

messageRoutes.post("/group", sendGroupMessage);

export default messageRoutes;
