import { Request, Response } from "express";
import User from "../../../../models/user.model";
import Job from "../../../../models/jobs.model";

export const userViewJob = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  const idUser = req.body.idUser;
  const idJob = req.body.idJob;
  if (!idUser) {
    res.status(401).json({
      code: 401,
      error: "Vui lòng nhập id user",
    });
    return;
  }
  if (!idJob) {
    res.status(401).json({
      code: 401,
      error: "Vui lòng nhập id công việc",
    });
    return;
  }
  const user = await User.findById({ _id: idUser });
  if (!user) {
    res.status(401).json({
      code: 401,
      error: "Truy cập không hợp lệ",
    });
    return;
  }
  const job = await Job.findById({ _id: idJob });
  if (!job) {
    res.status(401).json({
      code: 401,
      error: "Truy cập không hợp lệ",
    });
    return;
  }
  const checkUserToJob = await Job.findOne({
    _id: idJob,
    "listProfileViewJob.idUser": idUser,
  }).select("_id");

  if (checkUserToJob) {
    res.status(200).json({
      code: 200,
    });
    return;
  }
  next();
};

export const getPdfToDriver = (
  req: Request,
  res: Response,
  next: any
): void => {
  try {
    if (!req.body.id_file) {
      res.status(400).json({ error: "File ID Chưa Có Dữ Liệu!", code: 400 });
      return;
    }
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};