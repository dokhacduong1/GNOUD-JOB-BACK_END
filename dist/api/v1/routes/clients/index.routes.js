"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const employer_routes_1 = require("./employer.routes");
const job_routes_1 = require("./job.routes");
const jobCategories_routes_1 = require("./jobCategories.routes");
const routesClientVersion1 = (app) => {
    const version = "/api/v1/client";
    app.use(version + "/employers", employer_routes_1.employerRoutes);
    app.use(version + "/jobs", job_routes_1.jobRoutes);
    app.use(version + "/job-categories", jobCategories_routes_1.jobCategoriesRoutes);
};
exports.default = routesClientVersion1;
