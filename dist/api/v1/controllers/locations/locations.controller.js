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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullAddress = exports.getCoordinate = exports.getDetailedAddress = exports.getAreaDetails = void 0;
const allLocation_1 = require("../../../../helpers/allLocation");
const selectFields_1 = require("../../../../helpers/selectFields");
const getAreaDetails = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const keyword = req.body.keyword;
            const result = yield (0, allLocation_1.areaDetails)(keyword);
            if (result["predictions"].length === 0) {
                res.status(200).json({ code: 200, data: [] });
                return;
            }
            const convertData = result.predictions.map((item) => {
                let ward = "";
                let district = "";
                let city = "";
                if (item.terms.length >= 1) {
                    city = item.terms[item.terms.length - 1] || "";
                }
                if (item.terms.length >= 2) {
                    district = item.terms[item.terms.length - 2] || "";
                }
                if (item.terms.length >= 3) {
                    ward = item.terms[item.terms.length - 3] || "";
                }
                return { ward, district, city };
            });
            res.status(200).json({ code: 200, data: convertData });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getAreaDetails = getAreaDetails;
const getDetailedAddress = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ward = req.body.ward;
            const district = req.body.district;
            const city = req.body.city;
            const keyword = req.body.keyword;
            const result = yield (0, allLocation_1.detailedAddress)(ward, district, city, keyword);
            if (result["status"] !== "OK") {
                res.status(200).json({ code: 200, data: [] });
                return;
            }
            const fields = ["description", "id", "structured_formatting"];
            const resultConvert = (0, selectFields_1.selectFields)(result["predictions"], fields);
            res.status(200).json({ code: 200, data: resultConvert });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getDetailedAddress = getDetailedAddress;
const getCoordinate = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const placeid = req.body.placeid;
            const result = yield (0, allLocation_1.Coordinate)(placeid);
            if (!result["result"] || result.status !== "OK") {
                res.status(200).json({ code: 200, data: [] });
                return;
            }
            const { location } = result.result.geometry;
            const { place_id } = result.result;
            const data = {
                location,
                place_id,
            };
            res.status(200).json({ code: 200, data });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getCoordinate = getCoordinate;
const getFullAddress = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const input = req.body.input;
            const result = yield (0, allLocation_1.fullAddress)(input);
            if (!result["predictions"] || result.status !== "OK") {
                res.status(200).json({ code: 200, data: [] });
                return;
            }
            const fields = ["description", "place_id", "structured_formatting"];
            const resultConvert = (0, selectFields_1.selectFields)(result["predictions"], fields);
            res.status(200).json({ code: 200, resultConvert });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getFullAddress = getFullAddress;
