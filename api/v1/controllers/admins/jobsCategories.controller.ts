
import e, { Request, Response } from "express";


import { filterQueryStatus } from "../../../../helpers/filterQueryStatus.";
import { filterQuerySearch } from "../../../../helpers/filterQuerySearch";
import { filterQueryPagination } from "../../../../helpers/filterQueryPagination.";
import * as createTree from "../../../../helpers/createTree";


import * as JobCategoriesInterface from "../../interfaces/jobsCategories.interface";
import { encryptedData } from "../../../../helpers/encryptedData";
import JobCategories from "../../../../models/jobCategories.model";
import { convertToSlug } from "../../../../helpers/convertToSlug";


//VD: {{BASE_URL}}/api/v1/admin/job-categories?page=1&limit=7&sortKey=companyName&sortValue=asc&status=active$findAll=true
export const index = async function (req: Request, res: Response): Promise<void> {
    try {
        const permissions = req['userAdmin'].permissions;
        if (!permissions.includes("job-categories-view")) {
            res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
            return;
        }
        //Khai báo biến find.

        const find: JobCategoriesInterface.Find = {
            deleted: false,

        };

        //Khai báo các biến query
        let queryStatus: string = "";
        let querySortKey: string = "";
        let querySortValue: string = "";
        let queryPage: number = 1;
        let queryLimit: number = 6;
        let queryKeyword: string = "";

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

        //Nếu tồn tại keyword bắt đầu tìm kiếm theo keyword đối chiếu database(Chức Tìm Kiếm)
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





        //Trước khi gán title vào find thì kiểm tra query có hợp lệ hoặc tồn tại hay không. (Chức Năng Tìm Kiếm)
        if (queryKeyword && filterQuerySearch(queryKeyword)) {
            find.occupationName = filterQuerySearch(queryKeyword);
        }
        //Trước khi gán status vào find thì kiểm tra query có hợp lệ hoặc tồn tại hay không. (Chức Năng Check Trạng Thái)
        if (queryStatus && filterQueryStatus(queryStatus)) {
            find.status = queryStatus;
        }
        //Đếm xem bảng record có bao nhiêu sản phẩm và check phân trang (Chức Năng Phân Trang)
        const countRecord = await JobCategories.countDocuments(find);

        const objectPagination = filterQueryPagination(countRecord, queryPage, queryLimit);

        //Tạo một object gán sortKey , sortValue tìm được vào  (Chức Năng Sắp Xếp)
        let sort = {};
        //Nếu tồn tại thì mới gán vào sort
        if (querySortKey && querySortValue) {
            sort = {
                [querySortKey]: querySortValue
            };
        }

        let records = [];
        //Check xem nếu query có fillAll hay không nếu có người dùng muốn lấy hết dữ liệu
        if (req.query.findAll === "true") {
            records = await JobCategories.find(find)
                .sort(sort)
            if (req.query.tree === "true") {
                //Convert lại thành key gửi cho client
                records = createTree.tree2(records)
            }
        } else {
            //Nếu không sẽ lấy theo tiêu chí
            records = await JobCategories.find(find)
                .sort(sort)
                .limit(objectPagination.limitItem)
                .skip(objectPagination.skip)
        }

     

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



// [POST] /api/v1/admin/job-categories/create
export const create = async function (req: Request, res: Response): Promise<void> {

    try {
        const permissions = req['userAdmin'].permissions
        if (!permissions.includes("job-categories-create")) {
            res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
            return;
        }
        //Lấy ra tổng bản ghi của job category
        const cout = await JobCategories.countDocuments({});
        //Định dạng bản ghi lưu vào database
        const JobCategorie = {
            title: req.body.title,
            parent_id: req.body.parent_id,
            status: req.body.status,
            description: req.body.description
        };

        //Nếu có vị trí truyền vào thì ta cho vị trí đó là vị trí chỉ định không thì lấy số lượng bản ghi +1
        JobCategorie["position"] = parseInt(req.body.position) || cout + 1;
        //Nếu có ảnh thì gán không thì gán bằng rỗng
        JobCategorie["thumbnail"] = req.body.thumbUrl || "";

        const record = new JobCategories(JobCategorie);
        await record.save();

        res.status(201).json({ success: "Tạo Danh Mục Công Việc Thành Công!", code: 201 });

    } catch (error) {
        //Thông báo lỗi 500 đến người dùng server lỗi.
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }


}

// [PATCH] /api/v1/admin/job-categories/edit/:id
export const edit = async function (req: Request, res: Response): Promise<void> {

    try {
        const permissions = req['userAdmin'].permissions
        if (!permissions.includes("job-categories-edit")) {
            res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
            return;
        }

        //tạo một object recordNew để lưu dữ liệu mới
        const recordNew: JobCategoriesInterface.Find = {
            title: req.body.title,
            status: req.body.status,


        };
        //Nếu có id cha thì truyển vào không thì thôi
        if (req.body.parent_id) {
            recordNew["parent_id"] = req.body.parent_id
        }
        //Nếu có ảnh thì gán không thì thôi
        if (req.body.thumbUrl) {
            recordNew["thumbnail"] = req.body.thumbUrl
        }
        //Nếu có mô tả thì gán không thì thôi
        if (req.body.description) {
            recordNew["description"] = req.body.description
        }


        //Lấy ra id công việc muốn chỉnh sửa
        const id: string = req.params.id.toString();
        //Update công việc đó!
        await JobCategories.updateOne({ _id: id }, recordNew)

        res.status(200).json({ success: "Cập Nhật Công Việc Thành Công!", code: 200 });

    } catch (error) {
        //Thông báo lỗi 500 đến người dùng server lỗi.
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }


}


// [POST] /api/v1/admin/job-categories/delete/:id
export const deleteCategories = async function (req: Request, res: Response): Promise<void> {

    try {
        const permissions = req['userAdmin'].permissions
        if (!permissions.includes("job-categories-delete")) {
            res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
            return;
        }
        //Lấy ra id công việc muốn xóa
        const id: string = req.params.id.toString();
        //Bắt đầu xóa mềm dữ liệu,nghĩa là không xóa hẳn dữ liệu ra khỏi database mà chỉ chỉnh trường deteled thành true thôi
        await JobCategories.updateOne({ _id: id }, {
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


// [PATCH] /api/v1/admin/job-categories/change-status/:id
export const changeStatus = async function (req: Request, res: Response): Promise<void> {

    try {
        const permissions = req['userAdmin'].permissions
        if (!permissions.includes("job-categories-edit")) {
            res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
            return;
        }
        //Lấy id của thông tin trên params
        const id: string = req.params.id.toString();
        const status: string = req.body.status.toString();

        //Nếu qua được validate sẽ vào đây rồi update dữ liệu
        await JobCategories.updateOne({
            _id: id
        }, {
            status: status
        })

        //Trả về cập nhật trạng thánh thành công
        res.status(200).json({ success: "Cập Nhật Trạng Thái Thành Công!", code: 200 });

    } catch (error) {
        //Thông báo lỗi 500 đến người dùng server lỗi.
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// [PATCH] /api/v1/admin/job-categories/change-multi
export const changeMulti = async function (req: Request, res: Response): Promise<void> {

    try {
        const permissions = req['userAdmin'].permissions
        if (!permissions.includes("job-categories-edit")) {
            res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
            return;
        }
        enum KEY {
            STATUS = "status",
            DELETED = "deleted",
        }

        let ids: string[];
        let key: string;
        let value: string;
        //Mình sẽ lấy các phần tử người dùng gửi lên
        if (!req.body.ids || !req.body.key) {
            res.status(400).json({ error: "Dữ Liệu Không Hợp Lệ!" });
            return;
        }
        if (req.body.ids) {
            ids = req.body.ids;
        }
        if (req.body.key) {
            key = req.body.key.toString();
        }
        if (req.body.value) {
            value = req.body.value.toString();
        }

        switch (key) {
            //Trường hợp này key bằng status
            case KEY.STATUS:
                //Nếu dữ liệu người dùng gửi lên không giống các trạng thái thì báo lỗi dữ liệu không hợp lệ
                if (!filterQueryStatus(value)) {
                    res.status(400).json({ error: "Dữ Liệu Không Hợp Lệ!", code: 400 });
                    return;
                }
                //Update dữ liệu người dùng
                await JobCategories.updateMany({ _id: { $in: ids } }, {
                    status: value
                });
                //Trả về cập nhật trạng thánh thành công
                res.status(200).json({ success: "Cập Nhật Trạng Thái Thành Công!", code: 200 });
                break;
            case KEY.DELETED:
                //Xóa mềm dữ liệu của cảng mảng ids người dùng gửi lên,ghĩa là không xóa hẳn dữ liệu ra khỏi database mà chỉ chỉnh trường deteled thành true thôi
                await JobCategories.updateMany({ _id: ids }, {
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



// [GET] /api/v1/admin/job-categories/tree
export const tree = async function (req: Request, res: Response): Promise<void> {
    try {
        const permissions = req['userAdmin'].permissions;
        if (!permissions.includes("job-categories-view")) {
            res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
            return;
        }
        //Tạo một interface cho phù hợp với dữ liệu jobcategories
        const find: JobCategoriesInterface.Find = {
            deleted: false,
            status: "active"
        }
        //Bắt đầu tìm những bản ghi phù hợp điều kiện
        const record = await JobCategories.find(find);
        //Lấy những bản ghi đó tạo ra một tree để phân cấp
        const convertTree = createTree.tree2(record)
        //Mã hóa dữ liệu lại
        const dataEncrypted = encryptedData(convertTree)
        //Gửi dữ liệu di
        res.status(201).json({ data: dataEncrypted, code: 200 });
    } catch (error) {
        //Thông báo lỗi 500 đến người dùng server lỗi.
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

