import { Router } from "express";
import { gearController } from "./gear.contoller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";


const router = Router() 


router.post("/" ,auth(UserRole.ACTIVE , UserRole.CUSTOMER , UserRole.PROVIDER), gearController.createGear)

router.get("/" , gearController.getAllGear)
router.get("/:id" , gearController.getGearById)



export const gearRouter = router

