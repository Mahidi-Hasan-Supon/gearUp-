import { Router } from "express";
import { providerController } from "./provider.contoller";
import { auth } from "../middleware/auth";
import { UserRole } from "../../generated/prisma/enums";


const router = Router() 

router.post("/gear", auth(UserRole.PROVIDER),providerController.createGearByProvider)
router.put("/gear/:id",providerController.putGearByProvider)
// router.delete("/gear/:id",)
// router.get("/orders",)	
// router.patch("/orders/:id",)








export const providerRouter = router


