import { Router } from "express";
import * as controller from "../../controllers/locations/locations.controller";
import * as validates from "../../validates/locations/locations.validate"
const router : Router = Router();

router.post('/get_area_deltail',validates.getAreaDetails,controller.getAreaDetails )

router.post('/get-detailed-address',validates.getDetailedAddress,controller.getDetailedAddress)
router.post('/coordinate',validates.getCoordinate,controller.getCoordinate)
export const locationsRoutes : Router  = router