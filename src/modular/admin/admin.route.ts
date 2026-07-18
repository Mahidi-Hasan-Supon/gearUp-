import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router =Router() 
router.get("/users",auth(UserRole.ADMIN) , adminController.getUsers)
router.patch("/users/:id" ,auth(UserRole.ADMIN) , adminController.patchUserStatus)
router.get("/gear",auth(UserRole.ADMIN), adminController.getGear )
router.get("/rentals",auth(UserRole.ADMIN) , adminController.getRental )




export const adminRouter = router


