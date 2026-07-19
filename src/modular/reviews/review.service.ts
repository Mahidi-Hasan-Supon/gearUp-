import { RentalStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { ICreateReviewPayload } from "./review.interface"



const createReview = async(payload:ICreateReviewPayload , customerId:string)=>{

    const {rentalId , rating , comment} = payload 

    const rental = await prisma.rental.findUnique({
        where:{
            id:rentalId
        }
    })
    if(!rental){
        throw new Error("Rental not round")
    }
    
    console.log("Rental Customer ID:", rental.customerId);
     console.log("Logged In Customer ID:", customerId);
     
    if(rental.customerId !== customerId){
        throw new Error("You can review on your own rental")
    }
    if(rental.status !== RentalStatus.RETURNED){
        throw new Error("You can review only after returning the gear");
    }


    const existingReview = await prisma.review.findUnique({
        where:{
           rentalId
        }
    })
    if(existingReview){
        throw new Error("You have already created review")
    }

    const review = await prisma.review.create({
        data:{
            rating,
            comment,
            rentalId,
            customerId,
            gearId:rental.gearId

        }
    })

    return review



}


export const reviewService = {
    createReview
}