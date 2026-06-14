import Router from "express";
import {
  getDirectMessage,
  sendDirectMessage,
} from "../controllers/message.controller";

const messageRoutes = Router();

messageRoutes.get("/", getDirectMessage);

messageRoutes.post("/direct", sendDirectMessage);

export default messageRoutes;
