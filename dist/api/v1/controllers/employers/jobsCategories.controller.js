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
exports.countJobs = exports.index = void 0;
const filterQueryStatus_1 = require("../../../../helpers/filterQueryStatus.");
const filterQuerySearch_1 = require("../../../../helpers/filterQuerySearch");
const filterQueryPagination_1 = require("../../../../helpers/filterQueryPagination.");
const createTree = __importStar(require("../../../../helpers/createTree"));
const jobs_model_1 = __importDefault(require("../../../../models/jobs.model"));
const encryptedData_1 = require("../../../../helpers/encryptedData");
const jobCategories_model_1 = __importDefault(require("../../../../models/jobCategories.model"));
const convertToSlug_1 = require("../../../../helpers/convertToSlug");
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
                querySortKey = req.query.sortKey.toString() || "occupationName";
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
            if (queryStatus && (0, filterQueryStatus_1.filterQueryStatus)(queryStatus)) {
                find.status = queryStatus;
            }
            if (queryKeyword && (0, filterQuerySearch_1.filterQuerySearch)(queryKeyword)) {
                find.occupationName = (0, filterQuerySearch_1.filterQuerySearch)(queryKeyword);
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
            res.status(500).json({ error: "Internal Server Error", code: 500 });
        }
    });
};
exports.index = index;
const countJobs = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const find = {
                deleted: false,
                status: "active"
            };
            const recordJobcategories = yield jobCategories_model_1.default.find(find);
            const arr = [];
            for (let data of recordJobcategories) {
                const countRecord = yield jobs_model_1.default.countDocuments({
                    job_categorie_id: data.id
                });
                const dataObject = data.toObject();
                dataObject["countJob"] = countRecord;
                if (data["thumbnail"] === "") {
                    dataObject["thumbnail"] = "https://res.cloudinary.com/dmmz10szo/image/upload/v1703728915/vgmvvcn0te8lhdrbued1.webp";
                }
                arr.push(dataObject);
            }
            const dataEncrypted = (0, encryptedData_1.encryptedData)(arr);
            res.status(200).json({ data: dataEncrypted, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.countJobs = countJobs;
