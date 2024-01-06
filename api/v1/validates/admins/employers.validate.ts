import { Request, Response } from "express";
import { filterQueryStatus } from "../../../../helpers/filterQueryStatus.";

export const editStatus = (req: Request, res: Response, next: any) : void => {
    const status: string = req.body.status.toString();
    //Nếu dữ liệu người dùng gửi lên là rỗng thì báo lỗi chưa có dữ liệu
    if (!status) {
         res.status(400).json({ error: "Chưa Có Dữ Liệu!" });
         return;
    }
    //Nếu dữ liệu người dùng gửi lên không giống các trạng thái thì báo lỗi dữ liệu không hợp lệ
    if (!filterQueryStatus(status)) {
         res.status(400).json({ error: "Dữ Liệu Không Hợp Lệ!" });
         return;
    }
    next();
}

export const create = (req: Request, res: Response, next: any) : void => {
    //Lấy dữ liệu người dùng gửi lên
    const title: string = req.body.title.toString();
    const status: string = req.body.status.toString();
    const content: string = req.body.content.toString();
    const timeStart: string = req.body.timeStart.toString();
    const timeFinish: string = req.body.timeFinish.toString();


    //Nếu dữ liệu người dùng gửi lên là rỗng thì báo lỗi chưa có dữ liệu
    if (!title) {
         res.status(400).json({ error: "Tiêu Đề Chưa Có Dữ Liệu!" });
         return;
    }
    if (!status) {
         res.status(400).json({ error: "Trạng Thái Chưa Có Dữ Liệu!" });
         return;
    }
    if (!content) {
         res.status(400).json({ error: "Nội Dung Chưa Có Dữ Liệu!" });
         return;
    }
    if (!timeStart) {
         res.status(400).json({ error: "Thời Gian Bắt Đầu Chưa Có Dữ Liệu!" });
         return;
    }
    if (!timeFinish) {
         res.status(400).json({ error: "Thời Gian Hoàn Thành Chưa Có Dữ Liệu!" });
         return;
    }

    next();
}

export const edit = (req: Request, res: Response, next: any) : void => {
    const title: string = req.body.title.toString();
    //Nếu người dùng cố tình muốn đổi các trạng thái bên dưới thành rỗng thì in ra lỗi
    if (title === "") {
         res.status(400).json({ error: "Tiêu Đề Chưa Có Dữ Liệu!" });
         return;
    }

    next();
}