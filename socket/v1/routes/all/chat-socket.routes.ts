import { Socket } from "socket.io";
import { Server } from "socket.io";
import * as controller from "../../controllers/chat-socket.controller";

export const chatSocketRouter = (socket: Socket, io: Server) => {
    const roomChat = socket.handshake.auth.roomChat || "";
    socket.join(roomChat);
   
    socket.on("CLIENT_SEND_MESSAGE", controller.chatSocket(socket, io));
  };