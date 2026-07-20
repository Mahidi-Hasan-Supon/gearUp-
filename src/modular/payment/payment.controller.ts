import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utiles/catchAsync";
import { sendResponse } from "../../../utiles/sendResponse";
import httpStatus from "http-status";
import { paymentService } from "./payment.service";

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    // console.log("userId" , req.user?.id);
    const body = req.body;

    const result = await paymentService.createPayment(userId as string, body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Payment created successfully",
      data: result,
    });
  },
);

const confirmPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("boy" , req.body);
    const { session} = req.body;
    console.log("session contoller" , session);


    const result = await paymentService.confirmPayment(session);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment confirmed successfully",
      data: result,
    });
  },
);


const getPayment = catchAsync(async(req:Request , res:Response , next:NextFunction)=>{

    const userId = req.user?.id as string;

    const result = await paymentService.getPayment(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment history retrieved successfully",
      data: result,
    });
  }
)



const getPaymentById = catchAsync(async(req:Request , res:Response , next:NextFunction)=>{
    const { id } = req.params;

    const userId = req.user?.id as string;

    const result = await paymentService.getPaymentById(
      id as string,
      userId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment details retrieved successfully",
      data: result,
    });

  }
);




export const paymentController = {
  createPayment,
  confirmPayment,
  getPayment,
  getPaymentById
};
