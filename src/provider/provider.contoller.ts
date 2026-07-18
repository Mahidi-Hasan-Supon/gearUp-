import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utiles/catchAsync";
import { sendResponse } from "../../utiles/sendResponse";
import { providerService } from "./provider.service";
import httpStatus from "http-status";

const createGearByProvider = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id;

    const result = await providerService.createGearByProvider(
      payload,
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Gear create successfully",
      data: result,
    });
  },
);

const putGearByProvider = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id;
    const {id} = req.params;
    const body = req.body;

    const result = await providerService.putGearByProvider(providerId as string, id as string, body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Gear create successfully",
      data: result,
    });
  },
);

const deleteGearByProvider = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const providerController = {
  deleteGearByProvider,
  createGearByProvider,
  putGearByProvider,
};
