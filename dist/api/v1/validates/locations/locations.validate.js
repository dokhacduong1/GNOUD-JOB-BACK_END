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
const getAreaDetails = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.body.keyword) {
                res.status(400).json({ code: 401, error: "Vui lòng nhập từ khóa" });
                return;
            }
            next();
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ code: 500, error: "Internal Server Error" });
        }
    });
};
exports.getAreaDetails = getAreaDetails;
const getDetailedAddress = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.body.ward) {
                res.status(400).json({ code: 401, error: "Vui lòng nhập xã/phường" });
                return;
            }
            if (!req.body.district) {
                res.status(400).json({ code: 401, error: "Vui lòng nhập quận/huyện" });
                return;
            }
            if (!req.body.city) {
                res
                    .status(400)
                    .json({ code: 401, error: "Vui lòng nhập tỉnh/thành phố" });
                return;
            }
            if (!req.body.keyword) {
                res.status(400).json({ code: 401, error: "Vui lòng nhập từ khóa" });
                return;
            }
            next();
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getDetailedAddress = getDetailedAddress;
const getCoordinate = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.body.placeid) {
                res.status(400).json({ code: 401, error: "Vui lòng nhập id địa chỉ" });
                return;
            }
            next();
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getCoordinate = getCoordinate;
const getFullAddress = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.body.input) {
                res.status(400).json({ code: 401, error: "Vui lòng nhập từ khóa" });
                return;
            }
            next();
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getFullAddress = getFullAddress;
