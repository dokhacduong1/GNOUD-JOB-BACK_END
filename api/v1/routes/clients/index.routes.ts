
import { Express } from "express";
import { employerRoutes } from "./employer.routes";
import { jobRoutes } from "./job.routes";
import { jobCategoriesRoutes } from "./jobCategories.routes";


const routesClientVersion1 = (app: Express): void => {
    const version = "/api/v1/client";
    app.use(version + "/employers", employerRoutes);
    app.use(version +"/jobs",jobRoutes);
    app.use(version +"/job-categories",jobCategoriesRoutes)
}
export default routesClientVersion1