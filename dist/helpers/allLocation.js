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
exports.fullAddress = exports.Coordinate = exports.detailedAddress = exports.areaDetails = void 0;
const axios_1 = __importDefault(require("axios"));
const components = "country:VN";
const use_case = "shopee.account";
const use_case_C = `use_case=${use_case}&`;
const sessiontoken_C = `sessiontoken=8209fec7-36275-4cd3-a371-a1abae218b2&`;
const v_C = `v=3`;
function areaDetails(input) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = yield axios_1.default.post(process.env.DIVISION_AUTOCOMPLETE, {
                components,
                input: [{ text: input }],
                use_case,
                return_max_division_only: false,
            });
            return ((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a[0]) || [];
        }
        catch (error) {
            console.error("Error in API:", error);
            return [];
        }
    });
}
exports.areaDetails = areaDetails;
function detailedAddress(ward, district, city, input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const district_C = `city=${district}&`;
            const component_C = `components=${components}&`;
            const ward_C = `district=${ward}&`;
            const input_C = `input=${input}&`;
            const state_C = `state=${city}&`;
            const url = process.env.AUTOCOMPLETE +
                district_C +
                component_C +
                ward_C +
                input_C +
                sessiontoken_C +
                state_C +
                use_case_C +
                v_C;
            const { data } = yield axios_1.default.get(url);
            return data || [];
        }
        catch (error) {
            console.error("Error in API:", error);
            return [];
        }
    });
}
exports.detailedAddress = detailedAddress;
function Coordinate(placeid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const component_C = `components=${components}&`;
            const fields_C = `fields=geometry&`;
            const group_C = `group=DS&`;
            const placeid_C = `placeid=${placeid}&`;
            const url = process.env.DETAILS_LOCATION +
                component_C +
                fields_C +
                group_C +
                placeid_C +
                sessiontoken_C +
                use_case_C +
                v_C;
            const { data } = yield axios_1.default.get(url);
            return data || [];
        }
        catch (error) {
            console.error("Error in API:", error);
            return [];
        }
    });
}
exports.Coordinate = Coordinate;
function fullAddress(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(process.env.FULL_ADDRESS, {
                input: input,
                session_token: "1f7b30eb-6bdf-4af5-ac88-d2daaedfd1a5",
                components: components,
                use_case: process.env.USE_CASE,
                city: "",
                user_lat: 0,
                user_lng: 0,
                location: "",
                radius: 15000,
                language: "vi"
            });
            return response.data || [];
        }
        catch (error) {
            console.error("Error in API:", error);
            return [];
        }
    });
}
exports.fullAddress = fullAddress;
