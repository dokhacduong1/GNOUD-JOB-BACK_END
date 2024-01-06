"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterQuerySearch = void 0;
const filterQuerySearch = (query) => {
    const regex = new RegExp(query, "i");
    return regex;
};
exports.filterQuerySearch = filterQuerySearch;
