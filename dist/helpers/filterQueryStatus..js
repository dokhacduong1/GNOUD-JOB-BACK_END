"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterQueryStatusJobs = exports.filterQueryStatusJobsCategories = exports.filterQueryStatus = void 0;
const filterQueryStatus = (query) => {
    let filterQueryStatus = ["active", "inactive"];
    const checkQuery = filterQueryStatus.includes(query);
    return checkQuery;
};
exports.filterQueryStatus = filterQueryStatus;
const filterQueryStatusJobsCategories = (query) => {
    let filterQueryStatus = ["active", "inactive"];
    const checkQuery = filterQueryStatus.includes(query);
    return checkQuery;
};
exports.filterQueryStatusJobsCategories = filterQueryStatusJobsCategories;
const filterQueryStatusJobs = (query) => {
    let filterQueryStatus = ["active", "inactive", "pending", "refuse"];
    const checkQuery = filterQueryStatus.includes(query);
    return checkQuery;
};
exports.filterQueryStatusJobs = filterQueryStatusJobs;
