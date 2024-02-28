import { Request, Response } from "express";
import * as SkillInterface from "../../interfaces/skill.interface";
import Skill from "../../../../models/skills.model";
import { encryptedData } from "../../../../helpers/encryptedData";
// [GET] /api/v1/client/skill/index/
export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const find: SkillInterface.Find = {};
    if(req.query.title){
      find.title = req.query.title.toString();
    }
    const records = await Skill.find(find);
     //Mã hóa dữ liệu khi gửi đi
     const dataEncrypted = encryptedData(records);
    res.status(200).json({ data: dataEncrypted, code: 200 });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
