import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router()

router.post("/register",
    authController.createUser
)

router.post("/login" , authController.loginUser)
router.get("/me" ,
    auth(UserRole.ADMIN , UserRole.CUSTOMER ,UserRole.PROVIDER),
   authController.getMyProfile)

router.post("/refreshToken" , authController.refreshToken)

export const authRouter = router
