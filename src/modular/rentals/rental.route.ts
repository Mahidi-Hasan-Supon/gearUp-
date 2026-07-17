import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(UserRole.ACTIVE, UserRole.CUSTOMER, UserRole.PROVIDER),
  rentalController.createRental,
);

router.get("/" ,auth(UserRole.ACTIVE, UserRole.CUSTOMER, UserRole.PROVIDER), rentalController.getRental)

router.get("/:id" , rentalController.getRentalById)


export const rentalRouter = router;
