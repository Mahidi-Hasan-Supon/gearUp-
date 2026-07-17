import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";


const router = Router()

router.post("/",auth(UserRole.CUSTOMER , UserRole.ACTIVE, UserRole.PROVIDER), categoryController.createCategory)



router.get("/" ,auth(UserRole.CUSTOMER , UserRole.ACTIVE, UserRole.PROVIDER),  categoryController.getAllCategory)


export const categoryRouter = router 

