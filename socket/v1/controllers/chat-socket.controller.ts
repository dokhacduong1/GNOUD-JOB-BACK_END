import { Socket } from "socket.io";


export const chatSocket = (socket: Socket, io: any) => {
  const roomChat = socket.handshake.auth.roomChat || "";

  return async (msg: string) => {

    
    // Log tin nhắn và id của user
    const objectSend: {
      fullName: string;
      content: string;
      user_id: string;
    } = {
      fullName: socket["user"].fullName,
      content: msg,
      user_id: socket["user"]._id,
    };

    // Gửi tin nhắn về cho tất cả client
    io.to(roomChat).emit("SERVER_RETURN_MESSAGE", objectSend);
  };
};

