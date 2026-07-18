import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utiles/catchAsync";
import { gearService } from "./gear.service";
import { sendResponse } from "../../../utiles/sendResponse";
import httpStatus from "http-status"




const getAllGear = catchAsync(async(req:Request ,res:Response , next:NextFunction)=>{
    const query =req.query
    const result = await gearService.getAllGear(query)

        sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Get all gear",
        data:result
    })
})


const getGearById = catchAsync(async(req:Request , res:Response ,next:NextFunction)=>{

    const id = req.params.id

    const result = await gearService.getGearById(id as string)
        sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"Gear create successfully",
        data:result
    })


})


export const gearController = {

    getAllGear,
    getGearById
    
}

