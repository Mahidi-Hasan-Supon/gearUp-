import { get } from "node:http";
import { prisma } from "../../lib/prisma";
import { ICreateGearPayload, IGearQuery } from "./gear.interface";
import { GearWhereInput } from "../../../generated/prisma/models";


const getAllGear = async (query: IGearQuery) => {
  const minPrice = query.minPrice
    ? Number(query.minPrice)
    : undefined;

  const maxPrice = query.maxPrice
    ? Number(query.maxPrice)
    : undefined;

  const andCondition: GearWhereInput[] = [];

  // Brand Filter
  if (query.brand) {
    andCondition.push({
      brand: {
        contains: query.brand,
        mode: "insensitive",
      },
    });
  }

  // Category Filter
  if (query.category) {
    andCondition.push({
      category: {
        name: {
          contains: query.category,
          mode: "insensitive",
        },
      },
    });
  }

  // Price Filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    andCondition.push({
      pricePerDay: {
        ...(minPrice !== undefined && {
          gte: minPrice,
        }),

        ...(maxPrice !== undefined && {
          lte: maxPrice,
        }),
      },
    });
  }

  // Availability Date Filter
  if (query.startDate && query.endDate) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    andCondition.push({
      NOT: {
        rental: {
          some: {
            status: {
              in: [
                "PLACED",
                "CONFIRMED",
                "PAID",
                "PICKED_UP",
              ],
            },

            AND: [
              {
                startDate: {
                  lte: endDate,
                },
              },
              {
                endDate: {
                  gte: startDate,
                },
              },
            ],
          },
        },
      },
    });
  }

  const gear = await prisma.gear.findMany({
    where: {
      AND: andCondition,
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
      id,
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
  return gear;
};

export const gearService = {
  getAllGear,
  getGearById,
};
