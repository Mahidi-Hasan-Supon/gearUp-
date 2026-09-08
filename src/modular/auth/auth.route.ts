import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import upload from "../../lib/multer";

const router = Router();

router.post("/register", upload.single("photo"), authController.createUser);
router.post("/google", authController.googleLogin);
router.post("/login", authController.loginUser);
router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  authController.getMyProfile,
);

router.post("/refreshToken", authController.refreshToken);

export const authRouter = router;
