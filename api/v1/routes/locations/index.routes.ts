import { locationsRoutes } from "./locations.routes";
import { Express } from "express";
import * as middleware from "../../middlewares/employers/auth.middleware"
const routesLocations = (app: Express) : void => {
    const version = "/api/v1/";
    app.use(version + "locations", locationsRoutes);
  
}
export default routesLocations