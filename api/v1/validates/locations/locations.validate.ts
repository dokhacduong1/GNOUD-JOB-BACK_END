import { Request, Response } from "express";

export const getAreaDetails = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    if (!req.body.keyword) {
      res.status(400).json({ code: 401, error: "Vui lòng nhập từ khóa" });
      return;
    }
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ code: 500, error: "Internal Server Error" });
  }
};

export const getDetailedAddress = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    if (!req.body.ward) {
      res.status(400).json({ code: 401, error: "Vui lòng nhập xã/phường" });
      return;
    }
    if (!req.body.district) {
      res.status(400).json({ code: 401, error: "Vui lòng nhập quận/huyện" });
      return;
    }
    if (!req.body.city) {
      res
        .status(400)
        .json({ code: 401, error: "Vui lòng nhập tỉnh/thành phố" });
      return;
    }
    if (!req.body.keyword) {
      res.status(400).json({ code: 401, error: "Vui lòng nhập từ khóa" });
      return;
    }
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCoordinate = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    if (!req.body.placeid) {
      res.status(400).json({ code: 401, error: "Vui lòng nhập id địa chỉ" });
      return;
    }
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFullAddress = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    if (!req.body.input) {
      res.status(400).json({ code: 401, error: "Vui lòng nhập từ khóa" });
      return;
    }
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
