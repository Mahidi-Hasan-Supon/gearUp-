import { UserStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { IUpdateUserStatus } from "./admin.interface"


const getUsers = async()=>{


    const result = await prisma.user.findMany({
        orderBy:{
            createdAt:"desc"

        },omit:{
            password:true
        }
    })

    return result




}
const patchUserStatus = async(userId:string , payload:IUpdateUserStatus)=>{
    const {status} = payload
  const user = await prisma.user.findUnique({
    where:{
        id:userId
    }
  })
  if(!user){
    throw new Error("User not found")
  }
  if(user.status === UserStatus.BLOCKED){
    throw new Error("User status blocked")
  }
  
  const result = await prisma.user.update({
    where:{
     id:userId
    },
    data:{
        status:status
    }
  })

  return result



}
const getGear = async()=>{
   const gear = await prisma.gear.findMany({
    orderBy:{
        createdAt:"desc"
    },include:{
        provider:{
            select:{
                id:true,
                name:true,
                email:true,
                role:true,
                status:true
            }
        }
    }
   })
   return gear
}
const getRental = async()=>{
  const rental = await prisma.rental.findMany({
    orderBy:{
        createdAt:"desc"
    },include:{
        customer:{
            select:{
                name:true,
                email:true,
                role:true,
                status:true
            }
        },gear:{
            include:{
                provider:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        role:true
                    }
                }
            }
        }
    },
  })

  return rental
}




export const adminService ={
    getUsers,
    patchUserStatus,
    getGear,
    getRental
}

