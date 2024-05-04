import { Request, Response } from "express";
import Chat from "../../../../models/chat.model";
import { POPULATE } from "../../interfaces/populate.interface";

import User from "../../../../models/user.model";
import Employer from "../../../../models/employers.model";
import RoomChat from "../../../../models/rooms-chat.model";
import mongoose from "mongoose";

// [POST] /api/v1/clients/employer/chat/get-content-chat/:idUser
export const getContentChat = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Định nghĩa cấu trúc populate
    const populate: POPULATE[] = [
      {
        path: "user_id",
        select: "email phone fullName avatar",
        model: User,
      },

      {
        path: "room_chat_id",
        select: "typeRoom",
        model: RoomChat,
      },
    ];

    // Tìm tất cả các tin nhắn trong phòng chat và populate thông tin người dùng
    const record = await Chat.find({ room_chat_id: req["roomChat"] })
      .populate(populate)
      .select("content user_id");
      //Lấy ra loại phòng chat
    let typeRoom: string = "friend";
    // Chuyển đổi dữ liệu, thêm avatar từ logoCompany
    const convertData = record.map((item) => {
      //Nếu loại phòng chat là group thì gán typeRoom = group
      if (item.room_chat_id["typeRoom"] === "group") {
        typeRoom = "group";
      }
      return {
        content: item.content,
        user_id: item.user_id ? item.user_id["_id"] : req["user"]._id,
        avatar: item.user_id ? item.user_id["avatar"] : req["user"].logoCompany,
      };
    });

    // Gửi dữ liệu về cho client
    res.status(200).json({ data: convertData,typeRoom, code: 200 });
  } catch (error) {
    // Log lỗi và gửi thông báo lỗi 500 đến client
    console.error("Lỗi trong API:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

// [POST] /api/v1/employer/chat/get-history-chat/:idUser

export const getHistoryChat = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Định nghĩa thông tin để populate User từ RoomChat
    const populateInfo: POPULATE[] = [
      {
        path: "users.user_id", // Đường dẫn đến trường cần populate
        select: "email phone fullName avatar", // Chọn các trường cần lấy từ User
        model: User, // Model cần populate
      },
    ];

    // Sử dụng Promise.all để thực hiện song song hai thao tác: tìm RoomChat và thực hiện aggregate trên Chat
    const [rooms, chats, unreadCounts] = await Promise.all([
      // Tìm các RoomChat dựa trên listIdRoomChat từ req và populate User
      RoomChat.find({ _id: { $in: req["listIdRoomChat"] } }).populate(
        populateInfo
      ),
      // Thực hiện aggregate trên Chat để lấy tin nhắn cuối cùng và idUserChat cho mỗi room_chat_id
      Chat.aggregate([
        { $match: { room_chat_id: { $in: req["listIdRoomChat"] } } }, // Lọc các tin nhắn từ danh sách phòng chat
        { $sort: { room_chat_id: 1, createdAt: -1 } }, // Sắp xếp theo thời gian tạo và id phòng chat
        {
          $group: {
            _id: "$room_chat_id", // Nhóm các tin nhắn theo id phòng chat
            lastMessage: { $first: "$content" }, // Lấy nội dung tin nhắn đầu tiên (mới nhất) sau khi sắp xếp
            idUserChat: { $first: "$user_id" }, // Lấy id người dùng của tin nhắn đầu tiên (mới nhất) sau khi sắp xếp
          },
        },
      ]),

      // Thực hiện aggregate trên Chat để lấy số lượng tin nhắn chưa đọc cho mỗi room_chat_id
      Chat.aggregate([
        {
          $match: {
            room_chat_id: { $in: req["listIdRoomChat"] },
            read: false,
            user_id: { $ne: req["user"]._id.toString() },
          },
        }, // Lọc các tin nhắn từ danh sách phòng chat
        {
          $group: {
            _id: "$room_chat_id", // Nhóm các tin nhắn theo id phòng chat
            count: { $sum: 1 }, //Gôp các tin nhắn chưa đọc và công số lượng
          },
        },
      ]),
    ]);

    // Chuyển đổi dữ liệu thành định dạng mong muốn
    const data = rooms.map((room) => {
      // Tìm tin nhắn tương ứng với phòng chat
      const chatAll = chats.find(
        (item) => item._id.toString() === room._id.toString()
      );

      if (room.typeRoom === "group") {
        return {
          typeRoom: "group",
          room_chat_id: room._id || "", // id phòng chat
          avatar: room.avatar || "", // avatar phòng chat
          fullName: room.title || "", // tên phòng chat
          user_id: room._id, // id người dùng
          lastMessage: chats ? chatAll?.lastMessage || "" : "", // tin nhắn cuối cùng hoặc chuỗi rỗng nếu không có tin nhắn
          idUserChat: chats ? chatAll?.idUserChat || "" : "", // id người dùng của tin nhắn cuối cùng hoặc chuỗi rỗng nếu không có tin nhắn
          unreadCount: unreadCounts[0]?.count || 0, // Số lượng tin nhắn chưa đọc
        };
      }
      const unreadCount =
        unreadCounts.find((item) => item._id.toString() === room._id.toString())
          ?.count || 0;
      // Lấy thông tin người dùng từ phòng chat
      const user = room?.users[0]?.user_id;
      return {
        typeRoom: "friend",
        room_chat_id: room._id || "", // id phòng chat
        user_id: user?.["_id"] || "", // id người dùng
        fullName: user?.["fullName"] || "", // tên đầy đủ người dùng
        avatar: user?.["avatar"] || "", // avatar người dùng
        phone: user?.["phone"] || "", // số điện thoại người dùng
        email: user?.["email"] || "", // email người dùng
        lastMessage: chats ? chatAll?.lastMessage || "" : "", // tin nhắn cuối cùng hoặc chuỗi rỗng nếu không có tin nhắn
        idUserChat: chats ? chatAll?.idUserChat || "" : "", // id người dùng của tin nhắn cuối cùng hoặc chuỗi rỗng nếu không có tin nhắn
        unreadCount: unreadCount, // Số lượng tin nhắn chưa đọc
      };
    });

    // Gửi dữ liệu về cho client với status code 200
    res.status(200).json({ data: data, code: 200 });
  } catch (error) {
    // Log lỗi và gửi thông báo lỗi 500 đến client
    console.error("Lỗi trong API:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};
