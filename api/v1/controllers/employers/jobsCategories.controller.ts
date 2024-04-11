
import { Request, Response } from "express";


import { filterQueryStatus } from "../../../../helpers/filterQueryStatus.";
import { filterQuerySearch } from "../../../../helpers/filterQuerySearch";
import { filterQueryPagination } from "../../../../helpers/filterQueryPagination.";
import * as createTree from "../../../../helpers/createTree";
import Job from "../../../../models/jobs.model";

import * as JobCategoriesInterface from "../../interfaces/jobsCategories.interface";
import { encryptedData } from "../../../../helpers/encryptedData";
import JobCategories from "../../../../models/jobCategories.model";
import { convertToSlug } from "../../../../helpers/convertToSlug";


//VD: {{BASE_URL}}/api/v1/client/job-categories?page=1&limit=7&sortKey=companyName&sortValue=asc&status=active$findAll=true
export const index = async function (req: Request, res: Response): Promise<void> {
    try {
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
            querySortKey = req.query.sortKey.toString() || "occupationName";
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



        //Trước khi gán status vào find thì kiểm tra query có hợp lệ hoặc tồn tại hay không. (Chức Năng Check Trạng Thái)
        if (queryStatus && filterQueryStatus(queryStatus)) {
            find.status = queryStatus;
        }

        //Trước khi gán title vào find thì kiểm tra query có hợp lệ hoặc tồn tại hay không. (Chức Năng Tìm Kiếm)
        if (queryKeyword && filterQuerySearch(queryKeyword)) {
            find.occupationName = filterQuerySearch(queryKeyword);
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
        res.status(500).json({ error: "Internal Server Error",code:500 });
    }
}








// [GET] /api/v1/client/job-categories/count-job
export const countJobs = async function (req: Request, res: Response): Promise<void> {
    try {
        //Khai báo biến find.
        const find: JobCategoriesInterface.Find = {
            deleted: false,
            status: "active"
        };
        const recordJobcategories = await JobCategories.find(find)
        // Chuyển đổi data thành đối tượng có thể thay đổi (plain object).

        const arr: any = [];
        //Duyệt từng mảng record của occupation vừa tìm được
        for (let data of recordJobcategories) {
            //Đếm xe data này có bao nhiêu giá trị
            const countRecord = await Job.countDocuments({
                job_categorie_id: data.id
            });
            //tạo một object data trung gian để lưu dữ liệu từ record nếu không tạo sẽ không lưu được vì mặc định kiểu recordOccupation kia sẽ có kiểu là Occupation sẽ không gán lại dược
            const dataObject: any = data.toObject();
            // Gán giá trị cho thuộc tính "countJob".
            dataObject["countJob"] = countRecord;
            if (data["thumbnail"] === "") {
                dataObject["thumbnail"] = "https://res.cloudinary.com/dmmz10szo/image/upload/v1703728915/vgmvvcn0te8lhdrbued1.webp"
            }
            //Pust dataObject vừa nhận được vào mảng
            arr.push(dataObject)
        }

        //Mã hóa dữ liệu khi gửi đi
        const dataEncrypted = encryptedData(arr)
        //Ta trả dữ liệu ra giao diện
        res.status(200).json({ data: dataEncrypted, code: 200 });
    } catch (error) {
        //Thông báo lỗi 500 đến người dùng server lỗi.
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

}

