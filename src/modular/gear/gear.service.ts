import { get } from "node:http";
import { prisma } from "../../lib/prisma";
import { ICreateGearPayload, IGearQuery } from "./gear.interface";
import { GearWhereInput } from "../../../generated/prisma/models";


const getAllGear = async (query:IGearQuery) => {

    const minPrice = query.minPrice ? Number(query.minPrice) : undefined
    const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined

    const andCondition : GearWhereInput[] = []

    if(query.brand){
        andCondition.push({
        brand:{
            contains:query.brand,
            mode:"insensitive"
        }
        })
    }
    if(query.category){
        andCondition.push({
        category:{
            name:{
                contains:query.category,
                mode:"insensitive"
            }
        }
        })
    }

    if(query.minPrice){
        andCondition.push({
            pricePerDay:{
                gte:minPrice,
                lte:maxPrice
            }
        })
    }
    if(query.maxPrice){
        andCondition.push({
            pricePerDay:{
                lte:maxPrice
            }
        })
    }



  const gear = await prisma.gear.findMany({

   where:{
    AND:andCondition
   },

    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return gear;
};


const getGearById = async (id: string) => {

  const gear = await prisma.gear.findUnique({

    where: {
       id
    },
    include: {

      category: true,

      provider: {

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },

      },

    },

  });
  return gear


};

export const gearService = {
  getAllGear,
  getGearById,
};
