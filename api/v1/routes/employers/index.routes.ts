import { employerUserRoutes } from "./employer-user.routes";
import { Express } from "express";
import { jobCategoriesRoutes } from "./jobCategories.routes";
import { jobRoutes } from "./job.routes";
import * as authMiddlewares from "../../middlewares/employers/auth.middleware"
import { chatRoutes } from "./chat.routes";
import { cvRoutes } from "./cv.routes";
const routesEmployerVersion1 = (app: Express): void => {
    const version = "/api/v1/employer";
    app.use(version + "/users", employerUserRoutes);
    app.use(version +"/job-categories",jobCategoriesRoutes)
    app.use(version +"/jobs",authMiddlewares.auth,jobRoutes)
    app.use(version +"/chat",authMiddlewares.auth,chatRoutes)
    app.use(version +"/cvs",authMiddlewares.auth,cvRoutes)
}
export default routesEmployerVersion1