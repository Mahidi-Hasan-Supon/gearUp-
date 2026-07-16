import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import config from "../../config"
import { ICreatePayload } from "./auth.interface"


const createUserIntoDB= async(payload : ICreatePayload)=>{

    const {name , email , password , role} =payload

  const isExist = await prisma.user.findUnique({
    where:{
      email,
    },
  })

  if(isExist){
    throw new Error("User already Exist")
  }

  const hashPassword = await bcrypt.hash(password , Number(config.bcrypt_hash_pass))

  const createUser = await prisma.user.create({
    data:{
      name,
      email,
      password:hashPassword,
      role
    },
    omit:{
      password:true
    }
  })

  const user = await prisma.user.findUnique({
    where:{
      id:createUser.id,
      email:createUser.email
    },omit:{
      password:true
    }
  })
  return user



}



export const authService = {
    createUserIntoDB
}
