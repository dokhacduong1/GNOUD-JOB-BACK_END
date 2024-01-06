import * as rolesInterface from "../../interfaces/roles.interface";
import { Request, Response } from "express";
import Role from "../../../../models/roles.model";
import { convertToSlug } from "../../../../helpers/convertToSlug";
import { filterQueryPagination } from "../../../../helpers/filterQueryPagination.";
import { encryptedData } from "../../../../helpers/encryptedData";
import Admin from "../../../../models/admins.model";
//VD: //VD: {{BASE_URL}}/api/v1/admin/roles?page=1&limit=7&sortKey=title&sortValue=asc&status=active&featured=true&salaryKey=gt&salaryValue=1000&jobLevel=Intern&occupationKey=software-development
export const index = async function (req: Request, res: Response): Promise<void> {
    try {
        const permissions = req['userAdmin'].permissions;
        if(!permissions.includes("roles-view")){
            res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
            return;
        }
        //Khai báo biến find.

        const find: rolesInterface.Find = {
            deleted: false,

        };

        //Khai báo các biến query
        let queryStatus: string = "";
        let querySortKey: string = "";
        let querySortValue: string = "";
        let queryPage: number = 1;
        let queryLimit: number = 6;


        //Check xem nếu query có status thì gán vào biến checkQueryStatus không thì gán bằng rỗng. (Chức Năng Check Trạng Thái)
        if (req.query.status) {
            queryStatus = req.query.status.toString() || "";
        }

        //Check xem nếu query có sortKey  thì gán vào biến sortKey không thì gán bằng title. (Chức Năng Sắp Xếp)
        if (req.query.sortKey) {
            querySortKey = req.query.sortKey.toString() || "title";
        }

        //Check xem nếu query có sortValue  thì gán vào biến sortValue không thì gán bằng desc. (Chức Năng Sắp Xếp)
        if (req.query.sortValue) {
            querySortValue = req.query.sortValue.toString() || "asc";
        }

        //Check xem nếu query có queryPage thì gán vào biến queryPage không thì gán bằng rỗng. (Chức Năng Phân Trang)
        if (req.query.page) {
            queryPage = parseInt(req.query.page.toString());

        }

        //Check xem nếu query có queryLimit thì gán vào biến queryLimit không thì gán bằng 1. (Chức Năng Phân Trang)
        if (req.query.limit) {
            queryLimit = parseInt(req.query.limit.toString());
        }

        //Check xem nếu query có queryKeyword thì gán vào biến queryKeyword không thì gán bằng rỗng. (Chức Tìm Kiếm)
        if (req.query.keyword) {

            //Lấy ra key word của người dùng gửi lên
            const keyword: string = req.query.keyword.toString();
            //Chuyển keyword về dạng regex
            const keywordRegex: RegExp = new RegExp(keyword, "i");
            //Chuyển tất cả sang dạng slug 
            const unidecodeSlug: string = convertToSlug(keyword);
            //Chuyển slug vừa tạo qua regex
            const slugRegex: RegExp = new RegExp(unidecodeSlug, "i");
            //Tạo ra một mảng find có các tiêu chí tìm một là tìm theo title nếu không có tìm theo slug
            find["$or"] = [
                { title: keywordRegex },
                { keyword: slugRegex }
            ]

        }



        //Đếm xem bảng record có bao nhiêu sản phẩm và check phân trang (Chức Năng Phân Trang)
        const countRecord = await Role.countDocuments(find);

        const objectPagination = filterQueryPagination(countRecord, queryPage, queryLimit);

        //Tạo một object gán sortKey , sortValue tìm được vào  (Chức Năng Sắp Xếp)
        let sort = {};
        //Nếu tồn tại thì mới gán vào sort
        if (querySortKey && querySortValue) {
            sort = {
                [querySortKey]: querySortValue
            };
        }

        //Nếu không sẽ lấy theo tiêu chí
        const records = await Role.find(find)
            .sort(sort)
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip);

        //Mã hóa dữ liệu khi gửi đi
        const dataEncrypted = encryptedData(records)
        //Trả về công việc đó.
        res.status(200).json({ data: dataEncrypted, code: 200 });
    } catch (error) {
        //Thông báo lỗi 500 đến người dùng server lỗi.
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// [POST] /api/v1/admin/roles/create
export const create = async function (req: Request, res: Response): Promise<void> {
    try {
        //Check xem người dùng có quyền tạo quyền hay không
        const permissions = req['userAdmin'].permissions;
        if (!permissions.includes("roles-create")) {
            res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
            return;
        }

        //Định dạng bản ghi lưu vào database
        const role = {
            title: req.body.title,
            description: req.body.description || "",
        };

        //Tạo một bản ghi có dữ liệu của role mới
        const record = new Role(role);
        //Lưu bản ghi vào database
        await record.save();
        res.status(201).json({ success: "Tạo Quyền Thành Công!", code: 201 });

    } catch (error) {
        //Thông báo lỗi 500 đến người dùng server lỗi.
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// [PATCH] /api/v1/admin/roles/edit/:id
export const edit = async function (req: Request, res: Response): Promise<void> {

    try {
        //Check xem người dùng có quyền sửa quyền hay không
        const permissions = req['userAdmin'].permissions;
        if (!permissions.includes("roles-edit")) {
            res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
            return;
        }

        //tạo một object recordNew để lưu dữ liệu mới
        const recordNew: rolesInterface.Find = {
            title: req.body.title,

        };

        //Nếu có mô tả thì gán không thì thôi
        if (req.body.description) {
            recordNew["description"] = req.body.description
        }

        //Lấy ra id công việc muốn chỉnh sửa
        const id: string = req.params.id.toString();
        //Update quyền đó!
        await Role.updateOne({ _id: id }, recordNew)
        res.status(200).json({ success: "Cập Nhật Quyền Thành Công!", code: 200 });


    } catch (error) {
        //Thông báo lỗi 500 đến người dùng server lỗi.
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// [PATCH] /api/v1/admin/roles/edit-permissions/:id
export const editPermissions = async function (req: Request, res: Response): Promise<void> {
    try {
        //Check xem người dùng có quyền sửa quyền hay không
        const permissions = req['userAdmin'].permissions;
        
        if (!permissions.includes("roles-edit")) {
            res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
            return;
        }

        //Lấy ra id công việc muốn chỉnh sửa
        const id: string = req.params.id.toString();

        //tạo một object recordNew để lưu dữ liệu mới
        const recordNew: rolesInterface.Find = {
            permissions: req["role_permissions"],
        };

        //Update quyền đó!
        await Role.updateOne({ _id: id }, recordNew)


        res.status(200).json({ success: "Cập Nhật Quyền Thành Công!", code: 200 });

    } catch (error) {
        //Thông báo lỗi 500 đến người dùng server lỗi.
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// [POST] /api/v1/admin/roles/delete/:id
export const deleteRoles = async function (req: Request, res: Response): Promise<void> {
    try {
        const permissions = req['userAdmin'].permissions;
        if (!permissions.includes("roles-delete")) {
            res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
            return;
        }
        //Lấy ra id công việc muốn xóa
        const id: string = req.params.id.toString();
        //Bắt đầu xóa mềm dữ liệu,nghĩa là không xóa hẳn dữ liệu ra khỏi database mà chỉ chỉnh trường deteled thành true thôi
        await Role.updateOne({ _id: id }, {
            deleted: true,
            deletedAt: new Date()
        })

        res.status(200).json({ success: "Xóa Dữ Liệu Thành Công!", code: 200 });

    } catch (error) {
        //Thông báo lỗi 500 đến người dùng server lỗi.
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}



// [PATCH] /api/v1/admin/roles/change-multi
export const changeMulti = async function (req: Request, res: Response): Promise<void> {

    try {
        const permissions = req['userAdmin'].permissions;
        if (!permissions.includes("roles-edit")) {
            res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
            return;
        }
        enum KEY {
            DELETED = "deleted",
        }

        let ids: string[];
        let key: string;
        if (req.body.key) {
            key = req.body.key.toString();
        }
        //Mình sẽ lấy các phần tử người dùng gửi lên
        if (!req.body.ids || !req.body.key) {
            res.status(400).json({ error: "Dữ Liệu Không Hợp Lệ!" });
            return;
        }
        if (req.body.ids) {
            ids = req.body.ids;
        }
        switch (key) {
            case KEY.DELETED:
                //Xóa mềm dữ liệu của cảng mảng ids người dùng gửi lên,ghĩa là không xóa hẳn dữ liệu ra khỏi database mà chỉ chỉnh trường deteled thành true thôi
                await Role.updateMany({ _id: ids }, {
                    deleted: true,
                    deletedAt: new Date()
                })
                res.status(200).json({ success: "Xóa Dữ Liệu Thành Công!", code: 200 });
                break;
            default:
                //Trả về lỗi nếu không tồn tại key hợp lệ nào
                res.status(400).json({ error: "Yêu Cầu Không Hợp Lệ Hoặc Không Được Hỗ Trợ Vui Lòng Thử Lại!", code: 400 });
                break;
        }

    } catch (error) {
        //Thông báo lỗi 500 đến người dùng server lỗi.
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// [POST] /api/v1/admin/roles/info
export const info = async function (req: Request, res: Response): Promise<void> {
    try {
        const permissions = req['userAdmin'].permissions;
        if(!permissions.includes("roles-view")){
            res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
            return;
        }
        //Lấy dữ liệu info role
        const record = await Role.find({
            deleted: false,
        })

      
        //Mã hóa dữ liệu lại
        const dataEncrypted = encryptedData(record)
        res.status(200).json({ data: dataEncrypted, code: 200,role_id:req["userAdmin"].role_id  });
    } catch (error) {
        //Thông báo lỗi 500 đến người dùng server lỗi.
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}