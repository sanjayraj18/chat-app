import { Request, Response } from "express";
import { MessageService } from "../services/message.service";

const messageService = new MessageService();

export const sendDirectMessage = async (req: Request, res: Response) => {
  const { senderId, receiverId, message } = req.body;
  const result = await messageService.saveDirectMessage(
    senderId,
    receiverId,
    message,
  );

  const io = req.app.get("io");

  if (io) {
    io.to(`user_{receiverId}`).emit("new_message", result);
  }

  res.status(201).json(result);
};

export const getDirectMessage = async (req: Request, res: Response) => {
  const { userA, userB } = req.query;

  if (!userA || !userB) {
    return res.status(400).json({ error: "Missing user IDs" });
  }

  const messages = await messageService.getDirectMessage(
    userA as string,
    userB as string,
  );

  res.status(201).json({
    messages,
  });
  const {} = req.body;
};
