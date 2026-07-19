import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(UserRole.CUSTOMER),
  rentalController.createRental,
);

router.get("/" ,auth(UserRole.CUSTOMER), rentalController.getRental)

router.get("/:id" ,auth(UserRole.CUSTOMER), rentalController.getRentalById)


export const rentalRouter = router;
