import { Request, Response } from "express";

import * as CvInterface from "../../interfaces/cv.interface";
import Cv from "../../../../models/cvs.model";
import { POPULATE } from "../../interfaces/populate.interface";
import Job from "../../../../models/jobs.model";
import User from "../../../../models/user.model";
import { convertToSlug } from "../../../../helpers/convertToSlug";
// [GET] /api/v1/clients/employer/cvs/get-cv-apply
export const getCvApply = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const employerId: string = req["user"]._id;
    const find: CvInterface.Find = {
      employerId: employerId,
    };

    if (req.query.status) {
      find.status = req.query.status.toString();
    }
    if (req.query.keyword) {
      const keyword: string = req.query.keyword.toString();
      const keywordRegex: RegExp = new RegExp(keyword, "i");

      // Tìm kiếm User dựa trên fullName
      const users = await User.find({ fullName: keywordRegex }).select("_id");
      const userIds = users.map((user) => user._id);

      // Tìm kiếm Job dựa trên title
      const jobs = await Job.find({ title: keywordRegex }).select("_id");
      const jobIds = jobs.map((job) => job._id);

      // Thêm điều kiện tìm kiếm vào mảng find
      find["$or"] = [
        { email: keywordRegex },
        { phone: keywordRegex },
        { idUser: userIds },
        { idJob: jobIds },
      ];
    }
    const populate: POPULATE[] = [
      {
        path: "idJob",
        select: "title",
        model: Job,
      },
      {
        path: "idUser",
        select: "email phone fullName avatar",
        model: User,
      },
    ];
    const record = await Cv.find(find).populate(populate);

    res.status(200).json({ data: record, code: 200 });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [GET] /api/v1/clients/employer/cvs/get-cv-apply-accept
export const getCvApplyAccept = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const employerId: string = req["user"]._id;
    const find: CvInterface.Find = {
      employerId: employerId,
      status: "accept",
    };
    const populate: POPULATE[] = [
      {
        path: "idJob",
        select: "title",
        model: Job,
      },
      {
        path: "idUser",
        select: "email phone fullName avatar",
        model: User,
      },
    ];
    const record = await Cv.find(find)
      .populate(populate)
      .select("idUser")
      .sort({ createdAt: -1 })
      .limit(7);
    const convertRecord = record.map((item) => item.idUser);
    res.status(200).json({ data: convertRecord, code: 200 });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [GET] /api/v1/clients/employer/cvs/get-cv-info-user
export const getCvInfoUser = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    let data : any;
    if(req["infoRoom"]){
      data = {
        fullName: req["infoRoom"].title,
        avatar: req["infoRoom"].avatar,
        statusOnline: true,
      };
    } else {
      const idUser = req.params.idUser;
      data = await User.findOne({ _id: idUser }).select("email phone fullName avatar statusOnline");
    }
    res.status(200).json({ data, code: 200 });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
