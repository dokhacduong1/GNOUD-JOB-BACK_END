import { employerUserRoutes } from "./employer-user.routes";
import { Express } from "express";

const routesEmployerVersion1 = (app: Express): void => {
    const version = "/api/v1/employer";
    app.use(version + "/users", employerUserRoutes);
 
}
export default routesEmployerVersion1