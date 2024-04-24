"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterQueryEducationalLevelJobs = exports.filterQueryLevelJobs = exports.filterQueryWorkExperienceJobs = void 0;
const filterQueryWorkExperienceJobs = (query) => {
    let filterQueryValidate = ["no-required", "no-experience-yet", "duoi_1_nam", "1_nam", "2_nam", "3_nam", "4_nam", "5_nam", "tren_5_nam"];
    const checkQuery = filterQueryValidate.includes(query);
    return checkQuery;
};
exports.filterQueryWorkExperienceJobs = filterQueryWorkExperienceJobs;
const filterQueryLevelJobs = (query) => {
    let filterQueryValidate = [
        "student-intern",
        "just-have-graduated",
        "staff",
        "teamleader-supervisor",
        "manage",
        "vice-director",
        "manager",
        "general-manager",
        "president-vicepresident",
    ];
    const checkQuery = filterQueryValidate.includes(query);
    return checkQuery;
};
exports.filterQueryLevelJobs = filterQueryLevelJobs;
const filterQueryEducationalLevelJobs = (query) => {
    let filterQueryValidate = [
        "high-school",
        "intermediate-level",
        "college",
        "iniversity",
        "after-university",
        "other",
    ];
    const checkQuery = filterQueryValidate.includes(query);
    return checkQuery;
};
exports.filterQueryEducationalLevelJobs = filterQueryEducationalLevelJobs;
