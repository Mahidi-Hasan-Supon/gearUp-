import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utiles/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../../utiles/sendResponse";
import httpStatus from "http-status"


const createCategory = catchAsync(async(req:Request , res:Response , next:NextFunction)=>{
   const payload = req.body 
   const adminId =req.user?.id
   // console.log(payload);

   const result = await categoryService.createCategory(payload , adminId as string) 

   sendResponse(res,{
    success:true,
    statusCode:httpStatus.CREATED,
    message:"Category create successfully",
    data:result

   })


})


const getAllCategory = catchAsync(async(req:Request,res:Response , next:NextFunction)=>{
     const result = await categoryService.getAllCategory() 

    sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"All category here",
    data:result

   })
})



export const categoryController = {
    createCategory,
    getAllCategory
}
