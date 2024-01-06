"use strict";
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
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
const employers_model_1 = __importDefault(require("../../../../models/employers.model"));
const filterQueryStatus_1 = require("../../../../helpers/filterQueryStatus.");
const filterQuerySearch_1 = require("../../../../helpers/filterQuerySearch");
const filterQueryPagination_1 = require("../../../../helpers/filterQueryPagination.");
const encryptedData_1 = require("../../../../helpers/encryptedData");
const index = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
                queryKeyword = req.query.keyword.toString() || "";
            }
            if (queryStatus && (0, filterQueryStatus_1.filterQueryStatus)(queryStatus)) {
                find.status = queryStatus;
            }
            if (queryKeyword && (0, filterQuerySearch_1.filterQuerySearch)(queryKeyword)) {
                find.companyName = (0, filterQuerySearch_1.filterQuerySearch)(queryKeyword);
            }
            const countRecord = yield employers_model_1.default.countDocuments(find);
            const objectPagination = (0, filterQueryPagination_1.filterQueryPagination)(countRecord, queryPage, queryLimit);
            let sort = {};
            if (querySortKey && querySortValue) {
                sort = {
                    [querySortKey]: querySortValue
                };
            }
            const records = yield employers_model_1.default.find(find)
                .sort(sort)
                .limit(objectPagination.limitItem || 4)
                .skip(objectPagination.skip || 0)
                .select("-password -phoneNumber -listApprovedUsers -email -token");
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
const detail = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const find = {
                deleted: false,
                _id: id,
            };
            const task = yield employers_model_1.default.findOne(find);
            const dataEncrypted = (0, encryptedData_1.encryptedData)(task);
            res.status(200).json({ data: dataEncrypted });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.detail = detail;
const changeStatus = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id.toString();
            const status = req.body.status.toString();
            yield employers_model_1.default.updateOne({
                _id: id
            }, {
                status: status
            });
            res.status(200).json({ success: "Cập Nhật Trạng Thái Thành Công!" });
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
            let KEY;
            (function (KEY) {
                KEY["STATUS"] = "status";
                KEY["DELETED"] = "deleted";
            })(KEY || (KEY = {}));
            let ids = [];
            let key = "";
            let value = "";
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
                    if (value) {
                        if (!(0, filterQueryStatus_1.filterQueryStatus)(value)) {
                            res.status(400).json({ error: "Dữ Liệu Không Hợp Lệ!" });
                            return;
                        }
                        yield employers_model_1.default.updateMany({ _id: { $in: ids } }, {
                            status: value
                        });
                        res.status(200).json({ success: "Cập Nhật Trạng Thái Thành Công!" });
                        break;
                    }
                    else {
                        res.status(400).json({ error: "Vui Lòng Nhập Giá Trị!" });
                    }
                case KEY.DELETED:
                    if (ids.length > 0) {
                        yield employers_model_1.default.updateMany({ _id: ids }, {
                            deleted: true,
                            deletedAt: new Date()
                        });
                        res.status(200).json({ success: "Xóa Dữ Liệu Thành Công!" });
                        break;
                    }
                    else {
                        res.status(400).json({ error: "Vui Lòng Nhập Các Ứng Viên Cần Xóa!" });
                    }
                default:
                    res.status(400).json({ error: "Yêu Cầu Không Hợp Lệ Hoặc Không Được Hỗ Trợ Vui Lòng Thử Lại!" });
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
const create = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const task = new employers_model_1.default(req.body);
            yield task.save();
            res.status(201).json({ success: "Tạo Công Việc Mới Thành Công!" });
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
            const id = req.params.id.toString();
            yield employers_model_1.default.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: "Cập Nhật Công Việc Thành Công!" });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.edit = edit;
const deleteTask = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id.toString();
            yield employers_model_1.default.updateOne({ _id: id }, {
                deleted: true,
                deletedAt: new Date()
            });
            res.status(200).json({ success: "Xóa Dữ Liệu Thành Công!" });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.deleteTask = deleteTask;
