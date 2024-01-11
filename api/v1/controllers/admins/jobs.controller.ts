
import { Request, Response } from "express";
import Employer from "../../../../models/employers.model";
import * as JobInterface from "../../interfaces/job.interface"
import { filterQueryStatus } from "../../../../helpers/filterQueryStatus.";
import { filterQuerySearch } from "../../../../helpers/filterQuerySearch";
import { filterQueryPagination } from "../../../../helpers/filterQueryPagination.";
import { POPULATE } from "../../interfaces/populate.interface";
import Job from "../../../../models/jobs.model";


import { encryptedData } from "../../../../helpers/encryptedData";
import JobCategories from "../../../../models/jobCategories.model";

// [GET] /api/v1/admin/jobs/index/
//VD: //VD: {{BASE_URL}}/api/v1/admin/admin/jobs?page=1&limit=7&sortKey=title&sortValue=asc&status=active&featured=true&salaryKey=gt&salaryValue=1000&jobLevel=Intern&occupationKey=software-development
export const index = async function (req: Request, res: Response): Promise<void> {
    try {
        //Khai báo biến find.
        //Đoạn or là lấy ra các id có trong trường createdBy hoặc nếu không có trong trường createdBy thì lấy ra trong mảng listUsser nếu có
        //Nói chung có nghĩa là lấy các user có quyền tham gia được task này
        const find: JobInterface.Find = {
            deleted: false,

        };

        //Khai báo các biến query
        let queryStatus: string = "";
        let querySortKey: string = "";
        let querySortValue: string = "";
        let queryPage: number = 1;
        let queryLimit: number = 6;
        let queryKeyword: string = "";
        let queryFeatureValue: boolean = false;


        //Check xem có phải loại yêu thích không (Chức năng lọc yêu thích )
        if (req.query.featured) {
            queryFeatureValue = Boolean(req.query.featured);
        }

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
            queryKeyword = req.query.keyword.toString() || "";
        }
        if (req.query.jobCategoriesKey) {
            const keyword = req.query.jobCategoriesKey
            const idCategories = await JobCategories.findOne({
                slug: keyword
            }).select("id")
            find["job_categorie_id"] = idCategories.id
        }


        //Trước khi gán status vào find thì kiểm tra query có hợp lệ hoặc tồn tại hay không. (Chức Năng Check Trạng Thái)
        if (queryStatus && filterQueryStatus(queryStatus)) {
            find["status"] = queryStatus;
        }

        //Trước khi gán title vào find thì kiểm tra query có hợp lệ hoặc tồn tại hay không. (Chức Năng Tìm Kiếm)
        if (queryKeyword && filterQuerySearch(queryKeyword)) {
            find["title"] = filterQuerySearch(queryKeyword);
        }

        //Nếu tồn tại feature thì gán nó với value người dùng gửi lên  (Chức năng lọc yêu thích )
        if (queryFeatureValue) {
            find["featured"] = queryFeatureValue;
        }

        //Check xem nếu query gửi lên số lương muốn kiểm tra thì thêm vào cho nó (Chức năng check Lương)
        if (req.query.salaryKey && req.query.salaryValue) {
            //Nếu người dùng gửi lên key là gt người ta muốn check giá lơn hơn một giá trị nào đó
            if (req.query.salaryKey === "gt") {
                find["salary"] = { $gt: parseInt(req.query.salaryValue.toString()) }
            }
            //Nếu người dùng gửi lên key là gt người ta muốn check giá nhỏ hơn một giá trị nào đó
            if (req.query.salaryKey === "lt") {
                find["salary"] = { $lt: parseInt(req.query.salaryValue.toString()) }
            }
        }


        //Check xem nếu query gửi lên level của công ty muốn tuyển (Chức năng tìm kiếm kinh nghiệm làm việc của job đó)
        if (req.query.jobLevel) {
            find["level"] = req.query.jobLevel.toString();
        }

        //Đếm xem bảng record có bao nhiêu sản phẩm và check phân trang (Chức Năng Phân Trang)
        const countRecord = await Job.countDocuments(find);

        const objectPagination = filterQueryPagination(countRecord, queryPage, queryLimit);
        //Tạo một object gán sortKey , sortValue tìm được vào  (Chức Năng Sắp Xếp)
        let sort = {};
        //Nếu tồn tại thì mới gán vào sort
        if (querySortKey && querySortValue) {
            sort = {
                [querySortKey]: querySortValue
            };
        }

        //Tạo một mảng POPULATE có định dạng mặc định như dưới 
        const populateCheck: POPULATE[] = [
            {
                path: "employerId",
                select: "image companyName address",
                model: Employer
            },
            {
                path: "job_categorie_id",
                select: "title",
                model: JobCategories
            },

        ];

        //Check xem có bao job để phân trang
        const countJobs: number = Math.round((countRecord / queryLimit));

        let records = [];
        //Tìm tất cả các công việc.
        if (req.query.findAll) {
            records = await Job.find(find)
            .sort(sort)
            .select("").populate(populateCheck);
        }else{
            records = await Job.find(find)
            .sort(sort)
            .limit(objectPagination.limitItem || 4)
            .skip(objectPagination.skip || 0)
            .select("").populate(populateCheck);
        }
      
      
        //Mã hóa dữ liệu khi gửi đi
        const dataEncrypted = encryptedData(records)
        console.log(records)
        //Trả về công việc đó.
        res.status(200).json({ data: dataEncrypted, code: 200, countJobs: countJobs });
    } catch (error) {
        //Thông báo lỗi 500 đến người dùng server lỗi.
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}