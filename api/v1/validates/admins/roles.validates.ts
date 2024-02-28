import { Request, Response } from "express";
import Role from "../../../../models/roles.model";
const permissionsCheck = [
    "job-categories-create",
    "job-categories-edit",
    "job-categories-delete",
    "job-categories-view",
    "roles-edit",
    "roles-delete",
    "roles-create",
    "roles-view",
    "jobs-create",
    "jobs-edit",
    "jobs-delete",
    "jobs-view",]
export const createRecord = (req: Request, res: Response, next: any): void => {
    const title: string = req.body.title || "";
    //Nếu dữ liệu người dùng gửi lên là rỗng thì báo lỗi chưa có dữ liệu
    if (!title) {
        res.status(400).json({ error: "Chưa Có Tiêu Đề Dữ Liệu!", code: 400 });
        return;
    }

    next();
}

export const edit = (req: Request, res: Response, next: any): void => {
    const title: string = req.body.title.toString();
    //Nếu người dùng cố tình muốn đổi các trạng thái bên dưới thành rỗng thì in ra lỗi
    if (title === "") {
        res.status(400).json({ error: "Tiêu Đề Chưa Có Dữ Liệu!" })
        return;
    }

    next();
}

export const editPermissions = (req: Request, res: Response, next: any): void => {
    //Lấy các quyền người dùng gửi lên
    const permissions: Array<string> = req.body.permissions
    if (permissions.length > 0) {
        //Check xem nếu tất cả các quyền đề thỏa mãn thì mới cho đi tiếp
        const invalidPermissions = permissions.every(dataCheck => permissionsCheck.includes(dataCheck));
        if(!invalidPermissions){
            res.status(400).json({ error: "Quyền Không Hợp Lệ!" });
            return;
        }
    }
    //Lọc tát cả các quyền người dùng gửi lên trùng nhau
    const dataFilter = permissionsCheck.filter(dataCheck => permissions.includes(dataCheck));
    //gán nó vào biến req.role_permissions
    req["role_permissions"] = dataFilter
    next();
}