import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(UserRole.CUSTOMER), reviewController.createReview);

router.get("/my-reviews",auth(UserRole.CUSTOMER),reviewController.getMyReviews);

export const reviewRouter = router;
