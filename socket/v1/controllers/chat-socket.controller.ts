import { Socket } from "socket.io";
import Chat from "../../../models/chat.model";
import Employer from "../../../models/employers.model";
import User from "../../../models/user.model";
import RoomChat from "../../../models/rooms-chat.model";

export const chatSocket = (socket: Socket, io: any): any => {
  return async (msg: string) => {
   
    // Log tin nhắn và id của user
    const objectSend: {
      fullName: string;
      content: string;
      user_id: string;
      avatar: string;
    } = {
      fullName: socket["user"].fullName,
      content: msg,
      user_id: socket["user"]._id,
      avatar: socket["user"]?.avatar || socket["user"]?.logoCompany || "",
    };

    const record: {
      user_id?: string;
      room_chat_id?: string;
      content?: string;
      images?: Array<string>;
    } = {
      user_id: socket["user"]._id,
      room_chat_id: socket["roomChat"],
      content: msg,
      images: [],
    };
    const chat = new Chat(record);
    await chat.save();
    // Gửi tin nhắn về cho tất cả client
    io.to(socket["roomChat"]).emit("SERVER_RETURN_MESSAGE", objectSend);
    //Muốn trả ra một sự kiện để bên client nó nhận được một request yêu cầu check lịch sử chat lấy tin nhắn mới nhất
    io.emit("SERVER_RETURN_REQUEST_LOADMORE", {
      id_check: socket["user"]._id,
    });
  };
};

export const disconnectChatSocket = (socket: Socket, io: any): any => {
  return async (msg: string) => {
    // Lấy idUser và roomChat từ socket
    const idUser = socket["user"]._id;
    //Tạo một enum để quản lý role
    enum Role {
      EMPLOYER = "employer",
      USER = "client",
    }
    //Lấy role từ socket
    const role = socket?.handshake?.auth?.role;
    //Nếu không có role thì không thực hiện gì cả
    switch (role) {
      //Nếu role là employer thì cập nhật trạng thái online của employer
      case Role.EMPLOYER:
        await Employer.updateOne({ _id: idUser }, { statusOnline: false });
        break;
      //Nếu role là user thì cập nhật trạng thái online của user
      case Role.USER:
        await User.updateOne({ _id: idUser }, { statusOnline: false });
        break;
    }
    const roomChat = socket["roomChat"];
    // Nếu không có idUser hoặc roomChat thì không thực hiện gì cả
    if (!idUser || !roomChat) return;
    // Thoát khỏi phòng chat
    socket.leave(roomChat);
    // Gửi tin nhắn về cho tất cả client thông báo có người offline
    io.to(roomChat).emit("SERVER_RETURN_REQUEST_OFFLINE", {
      user_id: idUser,
      status: "offline",
    });
  };
};

//hàm này có task là cập nhật trạng thái đã đọc tin nhắn khi đang ở khung chat cùng đối phương
export const requestSeenChat = (socket: Socket, io: any): any => {
  return async (data: any) => {

    const idUser : string = data["idUser"];
    const idCheck : string = data["idCheck"];
    //idUser ở đây chính là idUser của đối phương đang nhắn tin cùng mình
    // Cập nhật trạng thái đã đọc tin nhắn

    if(idUser === idCheck){
      await Chat.updateMany(
        { user_id: idUser, room_chat_id: socket["roomChat"], read: false },
        { read: true }
      );
    }
    const exitedRoomChat = await RoomChat.findOne({
      _id:idUser,
      typeRoom: "group",
    });
    if(exitedRoomChat){
      await Chat.updateMany(
        { user_id: idCheck, room_chat_id: idUser, read: false },
        { read: true }
      );
    }
   
  };
};

export const sendTyping = (socket: Socket, io: any): any => {
  return async (idUser: string) => {
    const record: {
      user_id?: string;
      room_chat_id?: string;
    } = {
      user_id: socket["user"]._id,
      room_chat_id: socket["roomChat"],
    };
    //
    socket.broadcast
      .to(socket["roomChat"])
      .emit("SERVER_RETURN_TYPING", record);
  };
};
