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
exports.info = exports.changeMulti = exports.deleteRoles = exports.editPermissions = exports.edit = exports.create = exports.index = void 0;
const roles_model_1 = __importDefault(require("../../../../models/roles.model"));
const convertToSlug_1 = require("../../../../helpers/convertToSlug");
const filterQueryPagination_1 = require("../../../../helpers/filterQueryPagination.");
const encryptedData_1 = require("../../../../helpers/encryptedData");
const index = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req['userAdmin'].permissions;
            if (!permissions.includes("roles-view")) {
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
            const countRecord = yield roles_model_1.default.countDocuments(find);
            const objectPagination = (0, filterQueryPagination_1.filterQueryPagination)(countRecord, queryPage, queryLimit);
            let sort = {};
            if (querySortKey && querySortValue) {
                sort = {
                    [querySortKey]: querySortValue
                };
            }
            const records = yield roles_model_1.default.find(find)
                .sort(sort)
                .limit(objectPagination.limitItem)
                .skip(objectPagination.skip);
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
            if (!permissions.includes("roles-create")) {
                res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            const role = {
                title: req.body.title,
                description: req.body.description || "",
            };
            const record = new roles_model_1.default(role);
            yield record.save();
            res.status(201).json({ success: "Tạo Quyền Thành Công!", code: 201 });
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
            if (!permissions.includes("roles-edit")) {
                res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            const recordNew = {
                title: req.body.title,
            };
            if (req.body.description) {
                recordNew["description"] = req.body.description;
            }
            const id = req.params.id.toString();
            yield roles_model_1.default.updateOne({ _id: id }, recordNew);
            res.status(200).json({ success: "Cập Nhật Quyền Thành Công!", code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.edit = edit;
const editPermissions = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req['userAdmin'].permissions;
            if (!permissions.includes("roles-edit")) {
                res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            const id = req.params.id.toString();
            const recordNew = {
                permissions: req["role_permissions"],
            };
            yield roles_model_1.default.updateOne({ _id: id }, recordNew);
            res.status(200).json({ success: "Cập Nhật Quyền Thành Công!", code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.editPermissions = editPermissions;
const deleteRoles = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req['userAdmin'].permissions;
            if (!permissions.includes("roles-delete")) {
                res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            const id = req.params.id.toString();
            yield roles_model_1.default.updateOne({ _id: id }, {
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
exports.deleteRoles = deleteRoles;
const changeMulti = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req['userAdmin'].permissions;
            if (!permissions.includes("roles-edit")) {
                res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            let KEY;
            (function (KEY) {
                KEY["DELETED"] = "deleted";
            })(KEY || (KEY = {}));
            let ids;
            let key;
            if (req.body.key) {
                key = req.body.key.toString();
            }
            if (!req.body.ids || !req.body.key) {
                res.status(400).json({ error: "Dữ Liệu Không Hợp Lệ!" });
                return;
            }
            if (req.body.ids) {
                ids = req.body.ids;
            }
            switch (key) {
                case KEY.DELETED:
                    yield roles_model_1.default.updateMany({ _id: ids }, {
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
const info = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req['userAdmin'].permissions;
            if (!permissions.includes("roles-view")) {
                res.status(401).json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            const record = yield roles_model_1.default.find({
                deleted: false,
            });
            const dataEncrypted = (0, encryptedData_1.encryptedData)(record);
            res.status(200).json({ data: dataEncrypted, code: 200, role_id: req["userAdmin"].role_id });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.info = info;
