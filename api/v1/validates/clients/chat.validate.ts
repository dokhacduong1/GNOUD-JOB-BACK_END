import { Request, Response } from "express";
import RoomChat from "../../../../models/rooms-chat.model";
export const getContentChat = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    const clientId: string = req["user"]._id.toString();
    const idUser: string = req.params.idUser;
    if (!idUser || !clientId || idUser === "undefined" || clientId === "undefined") {
      res.status(400).json({ error: "Thiếu thông tin." });
      return;
    }
    if (clientId === idUser) {
      res
        .status(400)
        .json({ error: "Không thể xem thông tin của chính mình." });
      return;
    }
  
    const exitedRoomChatGroup = await RoomChat.findOne({
      _id: idUser,
      typeRoom: "group",
      "users.user_id": clientId,
    });
    if (exitedRoomChatGroup) {
      req["roomChat"] = exitedRoomChatGroup._id;
     
      next();
      return;
    }

    const exitedRoomChat = await RoomChat.findOne({
      "users.user_id": clientId,
      "users.employer_id": idUser,
      typeRoom: "friend",
    });
    if (!exitedRoomChat) {
      res.status(400).json({ error: "Không được quyền truy cập thông tin." });
      return;
    }
    req["roomChat"] = exitedRoomChat._id;
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getHistoryChat = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    const clientId: string = req["user"]._id.toString();

    if (!clientId ) {
      res.status(400).json({ error: "Thiếu thông tin." });
      return;
    }
    const exitedRoomChat = await RoomChat.find({
      "users.user_id": clientId,
    });
    if (!exitedRoomChat) {
      res.status(400).json({ error: "Không được quyền truy cập thông tin." });
      return;
    }
    const listIdRoomChat = exitedRoomChat.map((item) => item._id.toString());
    req["listIdRoomChat"] = listIdRoomChat;
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
