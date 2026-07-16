import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router()

router.post("/register",
    authController.createUser
)


export const authRouter = router
