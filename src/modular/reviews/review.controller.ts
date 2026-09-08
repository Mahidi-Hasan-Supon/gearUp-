import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utiles/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../../utiles/sendResponse";
import httpStatus from "http-status";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const payload = req.body;

    const result = await reviewService.createReview(
      payload,
      customerId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review created successfully",
      data: result,
    });
  },
);
const getMyReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;

const result = await reviewService.getMyReviews(customerId as string);

sendResponse(res, {
  success: true,
  statusCode: httpStatus.OK,
  message: "My reviews retrieved successfully",
  data: result,
});
  },
);

export const reviewController = {
  createReview,
  getMyReviews
};
