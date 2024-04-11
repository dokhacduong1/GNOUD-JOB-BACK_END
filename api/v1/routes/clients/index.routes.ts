
import { Express } from "express";
import { employerRoutes } from "./employer.routes";
import { jobRoutes } from "./job.routes";
import { jobCategoriesRoutes } from "./jobCategories.routes";
import { usersRoutes } from "./user-user.routes";
import { skillRoutes } from "./skill.routes";
import * as authMiddlewares from "../../middlewares/clients/auth.middleware"
import { chatRoutes } from "./chat.routes";

const routesClientVersion1 = (app: Express): void => {
    const version = "/api/v1/client";
    app.use(version + "/employers", employerRoutes);
    app.use(version + "/users", usersRoutes);
    app.use(version +"/jobs",jobRoutes);
    app.use(version +"/job-categories",jobCategoriesRoutes)
    app.use(version +"/skill",skillRoutes)
    app.use(version +"/chat",authMiddlewares.auth,chatRoutes)
}
export default routesClientVersion1