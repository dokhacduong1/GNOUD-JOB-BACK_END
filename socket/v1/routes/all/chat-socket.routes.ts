import { Socket } from "socket.io";
import { Server } from "socket.io";
import * as controller from "../../controllers/chat-socket.controller";
import RoomChat from "../../../../models/rooms-chat.model";
import Chat from "../../../../models/chat.model";

// Hàm chatSocketRouter xử lý logic chat thông qua socket
// Hàm chính xử lý logic chat thông qua socket
export const chatSocketRouter = async (socket: Socket, io: Server) => {
  // Lấy idUser từ thông tin xác thực của socket
  const { idUser = "" } = socket?.handshake?.auth || {};
  // Lấy id của user hiện tại từ socket
  const userMain = socket["user"]?._id.toString();

  // Nếu không có idUser hoặc userMain hoặc idUser trùng với userMain thì không thực hiện gì cả
  if (!userMain || !idUser || userMain === idUser) return;

  // Kiểm tra xem idUser có phải là id của phòng chat group không
  const typeRoom = await getTypeRoom(idUser);
  // Tìm phòng chat mà userMain và idUser đều tham gia
  const roomChat = await getRoomChat(userMain, idUser, typeRoom);

  // Nếu không tìm thấy phòng chat thì không thực hiện gì cả
  if (!roomChat) return;

  // Lấy id của phòng chat và lưu vào socket
  const roomChatId = roomChat["_id"].toString();
  socket["roomChat"] = roomChatId;

  // Tham gia vào phòng chat
  socket.join(roomChatId);

  // Cập nhật trạng thái của các tin nhắn chưa đọc trong phòng chat thành đã đọc
  await updateUnreadMessages(roomChatId, idUser);

  // Gửi tin nhắn về cho tất cả client trong phòng chat thông báo user hiện tại đang online
  io.to(roomChatId).emit("SERVER_RETURN_REQUEST_ONLINE", {
    user_id: userMain,
    status: "online",
  });

  // Đăng ký các sự kiện từ client
  registerEventHandlers(socket, io,typeRoom,userMain,roomChatId);
};

// Hàm kiểm tra xem idUser có phải là id của phòng chat group không
const getTypeRoom = async (idUser: string) => {
  const room = await RoomChat.findOne({ _id: idUser, typeRoom: "group" }).select("_id");
  return room ? "group" : "friend";
};

// Hàm tìm phòng chat mà userMain và idUser đều tham gia
const getRoomChat = async (userMain: string, idUser: string, typeRoom: string) => {
  const query = {
    "users.id_check": { $all: [userMain] },
    typeRoom: typeRoom,
  };

  if (typeRoom !== "group") {
    query["users.id_check"].$all.push(idUser);
  }

  return await RoomChat.findOne(query).select("_id");
};

// Hàm cập nhật trạng thái của các tin nhắn chưa đọc trong phòng chat thành đã đọc
const updateUnreadMessages = async (roomChatId: string, idUser: string) => {
  const chatQuery = {
    room_chat_id: roomChatId,
    user_id: idUser,
    read: false,
  };

  if ((await Chat.countDocuments(chatQuery)) > 0) {
    await Chat.updateMany(chatQuery, { $set: { read: true } });
  }
};

// Hàm đăng ký các sự kiện từ client
const registerEventHandlers = async (socket: Socket, io: Server,typeRoom: string,idUser : string,roomChatId: string) => {
 
  if(typeRoom === "group" && await RoomChat.findOne({ _id: roomChatId,"users.employer_id":idUser, typeRoom: "group" })) {
   
    socket.on("CLIENT_SEND_MESSAGE", controller.chatSocket(socket, io));
  }
  if(typeRoom === "friend"){
    socket.on("CLIENT_SEND_MESSAGE", controller.chatSocket(socket, io));
  }
  socket.on("CLIENT_SEND_REQUEST_SEEN_CHAT", controller.requestSeenChat(socket, io));
  socket.on("CLIENT_SEND_TYPING", controller.sendTyping(socket, io));
  socket.on("disconnect", controller.disconnectChatSocket(socket, io));
};