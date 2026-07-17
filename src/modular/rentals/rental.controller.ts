import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utiles/catchAsync";
import { rentalService } from "./rental.service";
import { sendResponse } from "../../../utiles/sendResponse";
import httpStatus from "http-status"


const createRental = catchAsync(async(req:Request , res:Response)=>{
    const customerId =req.user?.id 
    const payload = req.body

    const result = await rentalService.createRental(payload , customerId as string) 

    sendResponse(res,{
        success:true ,
        statusCode:httpStatus.CREATED,
        message:"Rental created successfully",
        data:result
    })

})



const getRental = catchAsync(async(req:Request , res:Response , nex:NextFunction)=>{

    const customerId = req.user?.id
          
    const result = await rentalService.getRental(customerId as string)


        sendResponse(res,{
        success:true ,
        statusCode:httpStatus.OK,
        message:"Rental retrieved successfully",
        data:result
    })


})



const getRentalById = catchAsync(async(req:Request , res:Response , next:NextFunction)=>{
    const {id} = req.params
    const result = await rentalService.getRentalById(id as string)

         sendResponse(res,{
        success:true ,
        statusCode:httpStatus.OK,
        message:"Rental retrieved successfully",
        data:result
    })

})



export const rentalController = {
    createRental,
    getRental,
    getRentalById
}

