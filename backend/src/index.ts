import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import { createServer } from "node:http";
import { Server } from "socket.io";
import messageRoutes from "./routes/message.routes";
import { setupChatSockets } from "./sockets/chat.socket";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/messages", messageRoutes);

setupChatSockets(io);
app.set("io", io);

const startServer = async () => {
  try {
    httpServer.listen(3000, () => {
      console.log("server started");
    });
  } catch (err) {
    console.warn("Error in staring server");
  }
};

startServer();
