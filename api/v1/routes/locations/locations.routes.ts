import { Router } from "express";
import * as controller from "../../controllers/locations/locations.controller";
import * as validates from "../../validates/locations/locations.validate"
import * as middleware from "../../middlewares/employers/auth.middleware"
const router : Router = Router();

router.post('/get_area_deltail',validates.getAreaDetails,controller.getAreaDetails )

router.post('/get-detailed-address',validates.getDetailedAddress,controller.getDetailedAddress)
router.post('/coordinate',validates.getCoordinate,controller.getCoordinate)
router.post('/get-full-address',middleware.auth,validates.getFullAddress,controller.getFullAddress)
export const locationsRoutes : Router  = router