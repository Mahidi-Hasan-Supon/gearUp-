import { UserRole } from "../../../generated/prisma/enums";


export interface ICreatePayload {
    name:string,
    email:string,
    role:UserRole,
    password:string
}

export interface ILoginPayload {
    email:string,
    password:string
}

