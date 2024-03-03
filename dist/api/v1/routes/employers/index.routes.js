"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const employer_user_routes_1 = require("./employer-user.routes");
const routesEmployerVersion1 = (app) => {
    const version = "/api/v1/employer";
    app.use(version + "/users", employer_user_routes_1.employerUserRoutes);
};
exports.default = routesEmployerVersion1;
