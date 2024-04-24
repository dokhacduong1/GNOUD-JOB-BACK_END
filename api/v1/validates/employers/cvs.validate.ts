import { Request, Response } from "express";
import RoomChat from "../../../../models/rooms-chat.model";
export const getCvInfoUser = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    //Lấy thông tin người dùng từ req
    const employerId: string = req["user"]._id.toString();
    const idUser: string = req.params.idUser;
    //Kiểm tra xem có thiếu thông tin không
    if (employerId === idUser) {
      res
        .status(400)
        .json({ error: "Không thể xem thông tin của chính mình." });
      return;
    }
    //Kiểm tra xem có thiếu thông tin không và idUser có phải là undefined không
    if (
      !idUser ||
      !employerId ||
      idUser === "undefined" ||
      employerId === "undefined"
    ) {
      res.status(400).json({ error: "Thiếu thông tin." });
      return;
    }
    //Tìm phòng chat theo idUser và employerId
    const exitedRoomChatGroup = await RoomChat.findOne({
      _id: idUser,
      "users.employer_id": employerId,
    });
    //Nếu tìm thấy phòng chat thì gán vào req và next
    if (exitedRoomChatGroup) {
      req["infoRoom"] = exitedRoomChatGroup;
      next();
      return;
    }
    //Tìm phòng chat theo idUser và employerId
    const exitedRoomChat = await RoomChat.findOne({
      "users.user_id": idUser,
      "users.employer_id": employerId,
    });
    //Nếu không tìm thấy phòng chat thì trả về lỗi
    if (!exitedRoomChat) {
      res.status(400).json({ error: "Không được quyền truy cập thông tin." });
      return;
    }

    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
