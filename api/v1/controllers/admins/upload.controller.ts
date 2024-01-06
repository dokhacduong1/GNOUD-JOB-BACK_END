
import { Request, Response } from "express";



//VD: {{BASE_URL}}/api/v1/admin/upload/image
export const image = async function (req: Request, res: Response): Promise<void> {
  res.status(200).json({location:req.body.file})
}

