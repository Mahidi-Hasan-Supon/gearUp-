
import { GearStatus } from "../../../generated/prisma/enums";
import { GearWhereInput } from "../../../generated/prisma/models";

export interface ICreateGearPayload {
  title: string;
  description: string;
  brand: string;
  pricePerDay: number;
  quantity: number;
  image?: string;
  categoryId: string;
  status?:GearStatus
}

export interface IGearQuery  {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
}
