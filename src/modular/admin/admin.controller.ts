import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utiles/catchAsync";
import { get } from "node:http";
import { sendResponse } from "../../../utiles/sendResponse";
import httpStatus from "http-status";
import { adminService } from "./admin.service";

const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Get all users successfully",
      data: result,
    });
  },
);

const patchUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const body = req.body;

    const result = await adminService.patchUserStatus(id as string, body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User status updated successfully",
      data: result,
    });
  },
);
const getGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getGear();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Get gear successfully",
      data: result,
    });
  },
);
const getRental = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getRental();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Get rental successfully",
      data: result,
    });
  },
);

export const adminController = {
  getUsers,
  patchUserStatus,
  getGear,
  getRental,
};
