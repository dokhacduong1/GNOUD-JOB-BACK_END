import { Socket } from "socket.io";

import { chatSocketRouter } from "./chat-socket.routes";
import * as middleware from "../../middlewares/auth-socket.middleware";
// Hàm này sẽ liên kết tất cả các socket chat
const routerSocketAll = (io: any) => {
  middleware.authSocket(io);
  io.on("connection", (socket: Socket) => {
    chatSocketRouter(socket, io);
  });
};
export default routerSocketAll;
