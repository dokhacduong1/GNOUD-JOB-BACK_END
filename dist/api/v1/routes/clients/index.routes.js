"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const employer_routes_1 = require("./employer.routes");
const job_routes_1 = require("./job.routes");
const jobCategories_routes_1 = require("./jobCategories.routes");
const user_user_routes_1 = require("./user-user.routes");
const skill_routes_1 = require("./skill.routes");
const routesClientVersion1 = (app) => {
    const version = "/api/v1/client";
    app.use(version + "/employers", employer_routes_1.employerRoutes);
    app.use(version + "/users", user_user_routes_1.usersRoutes);
    app.use(version + "/jobs", job_routes_1.jobRoutes);
    app.use(version + "/job-categories", jobCategories_routes_1.jobCategoriesRoutes);
    app.use(version + "/skill", skill_routes_1.skillRoutes);
};
exports.default = routesClientVersion1;
