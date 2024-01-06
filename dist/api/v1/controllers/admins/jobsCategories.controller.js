"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tree = exports.changeMulti = exports.changeStatus = exports.deleteCategories = exports.edit = exports.create = exports.index = void 0;
const filterQueryStatus_1 = require("../../../../helpers/filterQueryStatus.");
const filterQuerySearch_1 = require("../../../../helpers/filterQuerySearch");
const filterQueryPagination_1 = require("../../../../helpers/filterQueryPagination.");
const createTree = __importStar(require("../../../../helpers/createTree"));
const encryptedData_1 = require("../../../../helpers/encryptedData");
const jobCategories_model_1 = __importDefault(require("../../../../models/jobCategories.model"));
const convertToSlug_1 = require("../../../../helpers/convertToSlug");
const index = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req['userAdmin'].permissions;
            if (!permissions.includes("job-categories-view")) {
                res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            const find = {
                deleted: false,
            };
            let queryStatus = "";
            let querySortKey = "";
            let querySortValue = "";
            let queryPage = 1;
            let queryLimit = 6;
            let queryKeyword = "";
            if (req.query.status) {
                queryStatus = req.query.status.toString() || "";
            }
            if (req.query.sortKey) {
                querySortKey = req.query.sortKey.toString() || "title";
            }
            if (req.query.sortValue) {
                querySortValue = req.query.sortValue.toString() || "asc";
            }
            if (req.query.page) {
                queryPage = parseInt(req.query.page.toString());
            }
            if (req.query.limit) {
                queryLimit = parseInt(req.query.limit.toString());
            }
            if (req.query.keyword) {
                const keyword = req.query.keyword.toString();
                const keywordRegex = new RegExp(keyword, "i");
                const unidecodeSlug = (0, convertToSlug_1.convertToSlug)(keyword);
                const slugRegex = new RegExp(unidecodeSlug, "i");
                find["$or"] = [
                    { title: keywordRegex },
                    { keyword: slugRegex }
                ];
            }
            if (queryKeyword && (0, filterQuerySearch_1.filterQuerySearch)(queryKeyword)) {
                find.occupationName = (0, filterQuerySearch_1.filterQuerySearch)(queryKeyword);
            }
            if (queryStatus && (0, filterQueryStatus_1.filterQueryStatus)(queryStatus)) {
                find.status = queryStatus;
            }
            const countRecord = yield jobCategories_model_1.default.countDocuments(find);
            const objectPagination = (0, filterQueryPagination_1.filterQueryPagination)(countRecord, queryPage, queryLimit);
            let sort = {};
            if (querySortKey && querySortValue) {
                sort = {
                    [querySortKey]: querySortValue
                };
            }
            let records = [];
            if (req.query.findAll === "true") {
                records = yield jobCategories_model_1.default.find(find)
                    .sort(sort);
                if (req.query.tree === "true") {
                    records = createTree.tree2(records);
                }
            }
            else {
                records = yield jobCategories_model_1.default.find(find)
                    .sort(sort)
                    .limit(objectPagination.limitItem)
                    .skip(objectPagination.skip);
            }
            const dataEncrypted = (0, encryptedData_1.encryptedData)(records);
            res.status(200).json({ data: dataEncrypted, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.index = index;
const create = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req['userAdmin'].permissions;
            if (!permissions.includes("job-categories-create")) {
                res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            const cout = yield jobCategories_model_1.default.countDocuments({});
            const JobCategorie = {
                title: req.body.title,
                parent_id: req.body.parent_id,
                status: req.body.status,
                description: req.body.description
            };
            JobCategorie["position"] = parseInt(req.body.position) || cout + 1;
            JobCategorie["thumbnail"] = req.body.thumbUrl || "";
            const record = new jobCategories_model_1.default(JobCategorie);
            yield record.save();
            res.status(201).json({ success: "Tạo Danh Mục Công Việc Thành Công!", code: 201 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.create = create;
const edit = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req['userAdmin'].permissions;
            if (!permissions.includes("job-categories-edit")) {
                res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            const recordNew = {
                title: req.body.title,
                status: req.body.status,
            };
            if (req.body.parent_id) {
                recordNew["parent_id"] = req.body.parent_id;
            }
            if (req.body.thumbUrl) {
                recordNew["thumbnail"] = req.body.thumbUrl;
            }
            if (req.body.description) {
                recordNew["description"] = req.body.description;
            }
            const id = req.params.id.toString();
            yield jobCategories_model_1.default.updateOne({ _id: id }, recordNew);
            res.status(200).json({ success: "Cập Nhật Công Việc Thành Công!", code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.edit = edit;
const deleteCategories = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req['userAdmin'].permissions;
            if (!permissions.includes("job-categories-delete")) {
                res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            const id = req.params.id.toString();
            yield jobCategories_model_1.default.updateOne({ _id: id }, {
                deleted: true,
                deletedAt: new Date()
            });
            res.status(200).json({ success: "Xóa Dữ Liệu Thành Công!", code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.deleteCategories = deleteCategories;
const changeStatus = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req['userAdmin'].permissions;
            if (!permissions.includes("job-categories-edit")) {
                res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            const id = req.params.id.toString();
            const status = req.body.status.toString();
            yield jobCategories_model_1.default.updateOne({
                _id: id
            }, {
                status: status
            });
            res.status(200).json({ success: "Cập Nhật Trạng Thái Thành Công!", code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.changeStatus = changeStatus;
const changeMulti = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req['userAdmin'].permissions;
            if (!permissions.includes("job-categories-edit")) {
                res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            let KEY;
            (function (KEY) {
                KEY["STATUS"] = "status";
                KEY["DELETED"] = "deleted";
            })(KEY || (KEY = {}));
            let ids;
            let key;
            let value;
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
                case KEY.STATUS:
                    if (!(0, filterQueryStatus_1.filterQueryStatus)(value)) {
                        res.status(400).json({ error: "Dữ Liệu Không Hợp Lệ!", code: 400 });
                        return;
                    }
                    yield jobCategories_model_1.default.updateMany({ _id: { $in: ids } }, {
                        status: value
                    });
                    res.status(200).json({ success: "Cập Nhật Trạng Thái Thành Công!", code: 200 });
                    break;
                case KEY.DELETED:
                    yield jobCategories_model_1.default.updateMany({ _id: ids }, {
                        deleted: true,
                        deletedAt: new Date()
                    });
                    res.status(200).json({ success: "Xóa Dữ Liệu Thành Công!", code: 200 });
                    break;
                default:
                    res.status(400).json({ error: "Yêu Cầu Không Hợp Lệ Hoặc Không Được Hỗ Trợ Vui Lòng Thử Lại!", code: 400 });
                    break;
            }
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.changeMulti = changeMulti;
const tree = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req['userAdmin'].permissions;
            if (!permissions.includes("job-categories-view")) {
                res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            const find = {
                deleted: false,
                status: "active"
            };
            const record = yield jobCategories_model_1.default.find(find);
            const convertTree = createTree.tree2(record);
            const dataEncrypted = (0, encryptedData_1.encryptedData)(convertTree);
            res.status(201).json({ data: dataEncrypted, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.tree = tree;
