import { Router } from "express";
import { providerController } from "./provider.controller";
import { auth } from "../middleware/auth";
import { UserRole } from "../../generated/prisma/enums";


const router = Router() 

router.post("/gear", auth(UserRole.PROVIDER), providerController.createGearByProvider)
router.put("/gear/:id", auth(UserRole.PROVIDER), providerController.putGearByProvider)
router.delete("/gear/:id", auth(UserRole.PROVIDER), providerController.deleteGearByProvider)
router.get("/orders", auth(UserRole.PROVIDER), providerController.orderGetByProvider)	
router.patch("/orders/:id", auth(UserRole.PROVIDER), providerController.updateOrderByProviderStatus)








export const providerRouter = router


