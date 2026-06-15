import { Server, Socket } from "socket.io";

export const setupChatSockets = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("join_chat", (id: string) => {
      (socket.join(id), console.log(`Socket ${socket.id} joined room: ${id}`));
    });

    socket.on("typing", ({ roomId, userId }) => {
      socket.to(roomId).emit("user_typing", { userId });
    });
  });
};
