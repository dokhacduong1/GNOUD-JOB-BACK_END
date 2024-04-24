import { Request, Response } from "express";
import Employer from "../../../../models/employers.model";

// [GET] /api/v1/clients/client/cvs/get-cv-info-user
export const getCvInfoUser = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    let data: any;
    if (req["infoRoom"]) {
      data = {
        fullName: req["infoRoom"].title,
        logoCompany: req["infoRoom"].avatar,
        statusOnline: true,
      };
    } else {
      const idUser = req.params.idUser;
     
      data = await Employer.findOne({ _id: idUser }).select(
        "email phone fullName image statusOnline"
      );
      //Gán logoCompany = image nếu không phải group chat
      data["logoCompany"] = data["image"];
    }
  
    res.status(200).json({ data: data, code: 200 });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
