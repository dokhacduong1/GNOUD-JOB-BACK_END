import { Request, Response } from "express";
import Employer from "../../../../models/employers.model";
import * as JobInterface from "../../interfaces/job.interface";
import { filterQueryStatus } from "../../../../helpers/filterQueryStatus.";
import { filterQuerySearch } from "../../../../helpers/filterQuerySearch";
import { filterQueryPagination } from "../../../../helpers/filterQueryPagination.";
import { POPULATE } from "../../interfaces/populate.interface";
import Job from "../../../../models/jobs.model";

import { encryptedData } from "../../../../helpers/encryptedData";
import JobCategories from "../../../../models/jobCategories.model";
import { convertToSlug } from "../../../../helpers/convertToSlug";

import { searchPro } from "../../../../helpers/searchPro";

// [GET] /api/v1/client/jobs/index/
//VD: //VD: {{BASE_URL}}/api/v1/client/jobs?page=1&limit=7&sortKey=title&sortValue=asc&status=active&featured=true&salaryKey=gt&salaryValue=1000&jobLevel=Intern&occupationKey=software-development
export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Khai báo biến find.
    //Đoạn or là lấy ra các id có trong trường createdBy hoặc nếu không có trong trường createdBy thì lấy ra trong mảng listUsser nếu có
    //Nói chung có nghĩa là lấy các user có quyền tham gia được task này
    const find: JobInterface.Find = {
      deleted: false,
      status: "active",
    };

    //Khai báo các biến query
    let queryStatus: string = "";
    let querySortKey: string = "";
    let querySortValue: string = "";
    let queryPage: number = 1;
    let queryLimit: number = 6;
    let queryKeyword: string = "";
    let queryFeatureValue: boolean = false;
    let selectItem: string = "";

    if (req.query.selectItem) {
      selectItem = req.query.selectItem.toString();
    }

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
      const keyword = req.query.jobCategoriesKey;

      const idCategories = await JobCategories.findOne({
        slug: keyword,
      }).select("id");
      if (idCategories) {
        find["job_categorie_id"] = idCategories.id;
      }
      
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
        find["salary"] = { $gt: parseInt(req.query.salaryValue.toString()) };
      }
      //Nếu người dùng gửi lên key là gt người ta muốn check giá nhỏ hơn một giá trị nào đó
      if (req.query.salaryKey === "lt") {
        find["salary"] = { $lt: parseInt(req.query.salaryValue.toString()) };
      }
    }

    //Check xem nếu query gửi lên level của công ty muốn tuyển (Chức năng tìm kiếm kinh nghiệm làm việc của job đó)
    if (req.query.jobLevel) {
      find["level"] = req.query.jobLevel.toString();
    }

    //Đếm xem bảng record có bao nhiêu sản phẩm và check phân trang (Chức Năng Phân Trang)
    const countRecord = await Job.countDocuments(find);

    const objectPagination = filterQueryPagination(
      countRecord,
      queryPage,
      queryLimit
    );
    //Tạo một object gán sortKey , sortValue tìm được vào  (Chức Năng Sắp Xếp)
    let sort = {};
    //Nếu tồn tại thì mới gán vào sort
    if (querySortKey && querySortValue) {
      sort = {
        [querySortKey]: querySortValue,
      };
    }

    //Tạo một mảng POPULATE có định dạng mặc định như dưới
    const populateCheck: POPULATE[] = [
      {
        path: "employerId",
        select: "image companyName address",
        model: Employer,
      },
      {
        path: "job_categorie_id",
        select: "title",
        model: JobCategories,
      },
    ];

    //Check xem có bao job để phân trang
    const countJobs: number = Math.round(countRecord / queryLimit);

    //Tìm tất cả các công việc.
    const records = await Job.find(find)
      .sort(sort)
      .limit(objectPagination.limitItem || 4)
      .skip(objectPagination.skip || 0)
      .select(selectItem)
      .populate(populateCheck);
    const convertData = records.map((record) => ({
      ...record.toObject(),
      companyName: record["employerId"]["companyName"],
      companyImage: record["employerId"]["image"],
    }));
    //Mã hóa dữ liệu khi gửi đi
    const dataEncrypted = encryptedData(convertData);
    //Trả về công việc đó.
    res
      .status(200)
      .json({ data: dataEncrypted, code: 200, countJobs: countJobs });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [GET] /api/v1/client/jobs/jobSearch
export const jobSearch = async function (
  req: Request,
  res: Response
): Promise<void> {
  const slug = req.params.slug;
  try {
    const find: JobInterface.Find = {
      deleted: false,
      slug: slug,
      status: "active",
    };
    const populateCheck: POPULATE[] = [
      {
        path: "employerId",
        select: "image companyName address",
        model: Employer,
      },
      {
        path: "job_categorie_id",
        select: "title",
        model: JobCategories,
      },
    ];
    const records = await Job.findOne(find).populate(populateCheck);

    const convertData = {
      ...records.toObject(),
      companyName: records["employerId"]["companyName"],
      companyImage: records["employerId"]["image"],
      job_categories_title: records["job_categorie_id"].map(
        (item) => item.title
      ),
    };

    //Lấy công việc có cùng loại danh mục công việc
    const jobCategoriesId = records["job_categorie_id"].map((item) =>
      item._id.toString()
    );
    const recordJobCategories = await Job.find({
      job_categorie_id: { $in: jobCategoriesId },
      _id: { $ne: records._id },
      deleted: false,
      status: "active",
    })
      .populate(populateCheck)
      .select("address slug title salaryMin salaryMax");

    convertData["jobByCategories"] = recordJobCategories;

    const dataEncrypted = encryptedData(convertData);
    res.status(200).json({ data: dataEncrypted, code: 200 });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", code: 500 });
  }
};

// [POST] /api/v1/client/jobs/job-by-categories
export const jobsByCategories = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.status(200).json({ data: "ok", code: 200 });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [GET] /api/v1/client/jobs/search-position?keyword=...
export const jobSearchPosition = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const keyword: string = req.query.keyword?.toString() || "";
    //Nếu keyword rỗng thì trả về mảng rỗng
    if (keyword === "") {
      res.status(200).json({ data: [], code: 200 });
      return;
    }
    //Chuyển đổi keyword thành slug
    const unidecodeSlug: string = convertToSlug(keyword);
    //Tìm kiếm công việc có slug giống với slug của keyword
    const find: JobInterface.Find = {
      deleted: false,
      status: "active",
      $or: [
        { listTagName: { $regex: new RegExp(keyword, "i") } },
        { listTagSlug: { $regex: new RegExp(unidecodeSlug, "i") } },
      ],
    };

    const jobSearch = await Job.find(find, {
      listTagName: 1,
      listTagSlug: 1,
    }).limit(10);

    //Vào hàm serchPro lưu ý hàm này sẽ kiểu dạng là có slug ở database và một dạng keyword của slug ví dụ như keyword = "Kế toán" và slug="ke-toan"
    const convertArrr = searchPro(
      jobSearch,
      unidecodeSlug,
      "listTagName",
      "listTagSlug"
    );

    res.status(200).json({ data: convertArrr, code: 200 });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// [GET] /api/v1/client/jobs/advancedSearch
export const advancedSearch = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const find: JobInterface.Find = {
      deleted: false,
      status: "active",
      end_date: { $gte: new Date() },
    };
    let querySortKey: string = "title";
    let querySortValue: string = "asc";
    let queryPage: number = 1;
    let queryLimit: number = 20;
    let select: string = "-email -createdBy ";
    //Check xem nếu query có sortKey  thì gán vào biến sortKey không thì gán bằng title. (Chức Năng Sắp Xếp)
    if (req.query.sort_key) {
      querySortKey = req.query.sort_key.toString() || "title";
    }

    //Check xem nếu query có sortValue  thì gán vào biến sortValue không thì gán bằng desc. (Chức Năng Sắp Xếp)
    if (req.query.sort_value) {
      querySortValue = req.query.sort_value.toString() || "asc";
    }
    //Tạo một object gán sortKey , sortValue tìm được vào  (Chức Năng Sắp Xếp)
    let sort = {};
    //Nếu tồn tại thì mới gán vào sort
    if (querySortKey && querySortValue) {
      sort = {
        [querySortKey]: querySortValue,
      };
    }
    //Check xem nếu query có queryPage thì gán vào biến queryPage không thì gán bằng rỗng. (Chức Năng Phân Trang)
    if (req.query.page) {
      queryPage = parseInt(req.query.page.toString());
    }

    //Check xem nếu query có queryLimit thì gán vào biến queryLimit không thì gán bằng 1. (Chức Năng Phân Trang)
    if (req.query.limit) {
      queryLimit = parseInt(req.query.limit.toString());
    }
   
    //Tìm kiếu theo title công việc
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
      find["$or"] = [{ title: keywordRegex }, { keyword: slugRegex }];
    }
    //tìm kiếm theo loại danh mục công việc
    if (req.query.job_categories) {
      find["job_categorie_id"] = req.query.job_categories.toString();
    }
    //tìm kiếm theo loại công việc kiểu thực tập hay full time gì đó
    if (req.query.job_type) {
      find["jobType"] = req.query.job_type.toString();
    }
    if (req.query.job_level) {
      find["level"] = req.query.job_level.toString();
    }
    // tìm kiếm theo mức lương khoảng từ mức lương nhỏ nhất đến mức lương lớn nhất
    if (req.query.salary_min && req.query.salary_max) {
      find["salaryMax"] = {
        $gte: parseInt(req.query.salary_min.toString()),
        $lte: parseInt(req.query.salary_max.toString()),
      };
    }
    if (req.query.select) {
      select = req.query.select.toString();
      console.log(select);
    }

    //Tạo một mảng POPULATE có định dạng mặc định như dưới
    const populateCheck: POPULATE[] = [
      {
        path: "employerId",
        select: "image companyName address",
        model: Employer,
      },
      {
        path: "job_categorie_id",
        select: "title",
        model: JobCategories,
      },
    ];
   //Đếm xem bảng record có bao nhiêu sản phẩm và check phân trang (Chức Năng Phân Trang)
   const countRecord = await Job.countDocuments(find);

   const objectPagination = filterQueryPagination(
     countRecord,
     queryPage,
     queryLimit
   );

    //Check xem có bao job để phân trang
    const countJobs: number = Math.round(countRecord / queryLimit);

    const records = await Job.find(find)
      .populate(populateCheck)
      .sort(sort)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip)
      .select(select);
    const convertData = records.map((record) => ({
      ...record.toObject(),
      companyName: record["employerId"]["companyName"],
      companyImage: record["employerId"]["image"],
    }));
    const dataEncrypted = encryptedData(convertData);
    res.status(200).json({ data: dataEncrypted, code: 200,countJobs:countJobs });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [POST] /api/v1/client/jobs/may-be-interested
export const mayBeInterested = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const jobCategoriesId = req.body.jobCategoriesId;
    const populateCheck: POPULATE[] = [
      {
        path: "employerId",
        select: "image companyName address",
        model: Employer,
      },
      {
        path: "job_categorie_id",
        select: "title",
        model: JobCategories,
      },
    ];
    let job = await Job.find({
      job_categorie_id: jobCategoriesId,
      deleted: false,
      status: "active",
      salaryMax: { $gte: 0 },
    })
      .sort({ salaryMax: -1 })
      .limit(1)
      .populate(populateCheck)
      .select("-email -deleted -status -phone")
      .then((jobs) => jobs[0]);

    if (!job) {
      const count = await Job.countDocuments({
        deleted: false,
        status: "active",
        salaryMax: { $gte: 0 },
      });

      if (count === 0) {
        res.status(200).json({ data: [], code: 200 });
        return;
      }

      const random = Math.floor(Math.random() * count);

      job = await Job.findOne({
        deleted: false,
        status: "active",
        salaryMax: { $gte: 0 },
      })
        .skip(random)
        .populate(populateCheck)
        .select("-email -deleted -status -phone");
    }
    const convertData = {
      ...job.toObject(),
      companyName: job["employerId"]["companyName"],
      companyImage: job["employerId"]["image"],
    };
    res.status(200).json({ data: convertData, code: 200 });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
