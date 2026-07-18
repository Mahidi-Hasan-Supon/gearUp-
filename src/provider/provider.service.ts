import { prisma } from "../lib/prisma";
import { ICreateGearPayload } from "../modular/gear/gear.interface";

const createGearByProvider = async (
  payload: ICreateGearPayload,
  providerId: string,
) => {
  const {
    title,
    description,
    brand,
    pricePerDay,
    image,
    quantity,
    categoryId,
  } = payload;

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  if (!category) {
    throw new Error("Category not found");
  }

  const existingGear = await prisma.gear.findUnique({
    where: {
      title,
      brand,
      providerId,
    },
  });
  if (existingGear) {
    throw new Error("Title brand is existing the gear");
  }
  const result = await prisma.gear.create({
    data: {
      title,
      brand,
      description,
      pricePerDay,
      image,
      quantity,
      categoryId,
      providerId,
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
  return result;
};

const putGearByProvider = async (
  providerId: string,
  gearId: string,
  payload: Partial<ICreateGearPayload>,
) => {
  const gear = await prisma.gear.findFirst({
    where: {
      id: gearId,
      providerId,
    },
  });
  if (!gear) {
    throw new Error("Gear not found or you are not the owner");
  }

  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const update = await prisma.gear.update({
    where: {
      id: gearId,
    },
    data: payload,
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

  return update

  
};

const deleteGearByProvider = async () => {};

export const providerService = {
  deleteGearByProvider,
  createGearByProvider,
  putGearByProvider,
};
