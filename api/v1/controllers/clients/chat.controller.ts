import { Request, Response } from "express";



// [POST] /api/v1/clients/employer/chat/private
export const chatPrivate = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    var io = req.app.get('socketio');
  
//    await linkChatSocketAll(req,res)
    res.status(200).json({ message: "Chat private" });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
