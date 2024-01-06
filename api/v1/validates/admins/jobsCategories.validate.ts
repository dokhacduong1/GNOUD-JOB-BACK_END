import { Request, Response } from "express";
import { filterQueryStatusJobsCategories } from "../../../../helpers/filterQueryStatus.";
export const editStatus = (req: Request, res: Response, next: any): void => {

     const status: string = req.body.status;
     //Nếu dữ liệu người dùng gửi lên là rỗng thì báo lỗi chưa có dữ liệu
     if (!status) {
          res.status(400).json({ error: "Chưa Có Dữ Liệu!", code: 400 });
          return;
     }
     //Nếu dữ liệu người dùng gửi lên không giống các trạng thái thì báo lỗi dữ liệu không hợp lệ
     if (!filterQueryStatusJobsCategories(status)) {
          res.status(400).json({ error: "Dữ Liệu  Trạng Thái Không Hợp Lệ!", code: 400 });
          return;
     }
     next();
}
export const createRecord = (req: Request, res: Response, next: any): void => {

     const title: string = req.body.title || "";
     const status: string = req.body.status || "";
     //Nếu dữ liệu người dùng gửi lên là rỗng thì báo lỗi chưa có dữ liệu
     if (!title) {
          res.status(400).json({ error: "Chưa Có Tiêu Đề Dữ Liệu!", code: 400 });
          return;
     }
     //Nếu dữ liệu người dùng gửi lên không giống các trạng thái thì báo lỗi dữ liệu không hợp lệ
     if (status) {
          if (!filterQueryStatusJobsCategories(status)) {
               res.status(400).json({ error: "Dữ Liệu Trạng Thái Không Hợp Lệ!", code: 400 });
               return;
          }
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