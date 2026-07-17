import { GearStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateRentalPayload } from "./rental.interface";



const createRental = async (
  payload: ICreateRentalPayload,
  customerId: string,
) => {
  const { startDate, endDate, gearId } = payload;

  const gear = await prisma.gear.findUnique({
    where: {
      id: gearId,
    },
  });
  if (!gear) {
    throw new Error("Gear not found");
  }

  if (gear.status !== GearStatus.AVAILABLE) {
    throw new Error("Gear is not available");
  }

  const startDateNew = new Date(startDate);
  const endDateNew = new Date(endDate);

  if (endDateNew <= startDateNew) {
    throw new Error("End date must be after start date");
  }

  const totalDays = Math.ceil(
    (endDateNew.getTime() - startDateNew.getTime()) / (1000 * 60 * 60 * 24),
  );

  const totalPrice = totalDays * gear.pricePerDay;

  const rental = await prisma.rental.create({
    data: {
      startDate:startDateNew,
      endDate:endDateNew,
      customerId,
      gearId,
      totalPrice,
      totalDays
    },
    include: {
      gear: true,

      customer: {

        select: {
          id: true,
          name: true,
          email: true,
        },

      },

    },

  });
  return rental
};



const getRental = async(customerId:string)=>{
  const rental = await prisma.rental.findMany({
    where:{
   customerId: customerId
    },include:{
        customer:{
            select:{
                id:true,
                name:true,
                email:true
            }
        },
        gear:{
            include:{
                category:true
            }
        }
    }
  })
  if(!rental){
    throw new Error("Rental not found")
  }


  return rental
}




const getRentalById = async(id:string)=>{
   const rental = await prisma.rental.findUnique({
    where:{
        id
    },
    include:{
        customer:{
            select:{
                id:true,
                name:true,
                email:true
            },
        },gear:{
            include:{
                category:true
            }
        }
    }
   }) 
   return rental
}




export const rentalService = {
  createRental,
  getRental,
  getRentalById,
};
