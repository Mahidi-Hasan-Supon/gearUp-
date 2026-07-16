import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import httpStatus from "http-status"
import { catchAsync } from "../../../utiles/catchAsync";
import { sendResponse } from "../../../utiles/sendResponse";

const createUser = catchAsync(async(req:Request , res:Response , next:NextFunction)=>{
    const body = req.body

    const result = await authService.createUserIntoDB(body)

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"User created successfully",
        data:{
            result
        }
    })
})



export const authController = {
    createUser
}

