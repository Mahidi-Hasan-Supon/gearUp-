import { prisma } from "../lib/prisma";
import { ICreateGearPayload } from "../modular/gear/gear.interface";
import { ICreateStatusPayload } from "./provider.interface";

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

  const existingGear = await prisma.gear.findFirst({
    where: {
      title,
      brand,
      providerId,
    },
  });
  if (existingGear) {
    throw new Error("Title brand already existing the gear");
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
  const gear = await prisma.gear.findUnique({
    where: {
      id: gearId,
    },
  });
  if (!gear) {
    throw new Error("Gear not found !");
  }
  if (gear.providerId !== providerId) {
    throw new Error("You are not the owner of this gear");
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }
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

  return update;
};

const deleteGearByProvider = async (gearId: string, providerId: string) => {
  const gear = await prisma.gear.findUnique({
    where: {
      id: gearId,
    },
  });
  if (!gear) {
    throw new Error("Gear not found!");
  }
  if (gear.providerId !== providerId) {
    throw new Error("You are not the owner of this gear");
  }

  const deleteProvider = await prisma.gear.delete({
    where: {
      id: gearId,
    },
  });

  return deleteProvider;
};

const orderGetByProvider = async (providerId: string) => {
  const result = await prisma.rental.findMany({
    where: {
      gear: {
        providerId: providerId,
      },
    },
    include: {
      gear: {
        select: {
          id: true,
          title: true,
          brand: true,
          pricePerDay: true,
          status: true,
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      },
    },
  });

  return result;
};

const updateOrderByProviderStatus = async (
  rentalId: string,
  providerId: string,
  payload: ICreateStatusPayload,
) => {
  const { status } = payload;

  const rental = await prisma.rental.findUnique({
    where: {
      id: rentalId,
    },
  });

  if (!rental) {
    throw new Error("Rental not found");
  }

  const gear = await prisma.gear.findUnique({
    where: {
      id: rental.gearId,
    },
  });

  if (!gear || gear.providerId !== providerId) {
    throw new Error("You are not the owner of this order");
  }  

  const updateStatus = await prisma.rental.update({
    where: {
      id: rentalId,
    },
    data: {
      status: status,
    },include: {
      gear: {
        select: {
          id: true,
          title: true,
          brand: true,
          pricePerDay: true,
          status: true,
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      },
    },
  });
  return updateStatus;
};

export const providerService = {
  deleteGearByProvider,
  createGearByProvider,
  putGearByProvider,
  orderGetByProvider,
  updateOrderByProviderStatus,
};
