
import  { Express } from "express";
import { employerRoutes } from "./employer.routes";
import { jobRoutes } from "./job.routes";
import { jobCategoriesRoutes } from "./jobCategories.routes";
import { uploadRoutes } from "./upload.routes";
import { adminRoutes } from "./admins.routes";
import { roleRoutes } from "./roles.routes";
import * as middleware from "../../middlewares/admins/auth.middleware"
const routesAdminVersion1 = (app : Express) : void => {
    const version = "/api/v1/admin";
    app.use(version +"/employers",employerRoutes);
    app.use(version +"/jobs",jobRoutes);
    app.use(version +"/job-categories",middleware.auth,jobCategoriesRoutes)
    app.use(version +"/admins",adminRoutes)
    app.use(version +"/uploads",uploadRoutes);
    app.use(version +"/roles",middleware.auth,roleRoutes);
}
export default routesAdminVersion1