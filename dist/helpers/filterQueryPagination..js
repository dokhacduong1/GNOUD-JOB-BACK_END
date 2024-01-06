"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterQueryPagination = void 0;
const filterQueryPagination = (countRecord, currentPage, limitItem) => {
    let objectPagination = {
        currentPage: currentPage,
        limitItem: limitItem,
    };
    objectPagination.skip = (currentPage - 1) * limitItem;
    const totalPage = Math.ceil(countRecord / limitItem);
    objectPagination.totalPage = totalPage;
    return objectPagination;
};
exports.filterQueryPagination = filterQueryPagination;
