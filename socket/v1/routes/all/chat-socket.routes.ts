import { Socket } from "socket.io";
import { Server } from "socket.io";
import * as controller from "../../controllers/chat-socket.controller";

export const chatSocketRouter = (socket: Socket, io: Server) => {
   
    socket.on("CLIENT_SEND_MESSAGE", controller.chatSocket(socket, io));
  };