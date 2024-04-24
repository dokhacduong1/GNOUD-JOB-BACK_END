"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locations_routes_1 = require("./locations.routes");
const routesLocations = (app) => {
    const version = "/api/v1/";
    app.use(version + "locations", locations_routes_1.locationsRoutes);
};
exports.default = routesLocations;
