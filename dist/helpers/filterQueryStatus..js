"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterQueryStatusCvJobsEmployer = exports.filterQueryStatusJobsEmployer = exports.filterQueryStatusJobs = exports.filterQueryStatusJobsCategories = exports.filterQueryStatus = void 0;
const filterQueryStatus = (query) => {
    let filterQueryStatus = ["active", "inactive", "pending", "refuse"];
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
const filterQueryStatusJobsEmployer = (query) => {
    let filterQueryStatus = ["active", "inactive"];
    const checkQuery = filterQueryStatus.includes(query);
    return checkQuery;
};
exports.filterQueryStatusJobsEmployer = filterQueryStatusJobsEmployer;
const filterQueryStatusCvJobsEmployer = (query) => {
    let filterQueryStatus = ["pending", "refuse", "accept"];
    const checkQuery = filterQueryStatus.includes(query);
    return checkQuery;
};
exports.filterQueryStatusCvJobsEmployer = filterQueryStatusCvJobsEmployer;
