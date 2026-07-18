import { prisma } from "../../lib/prisma"
import { ICategoryPayload } from "./category.interface"




const createCategory = async(payload:ICategoryPayload , adminId:string)=>{
    const { name } = payload
    console.log(name , "name");
    const findCategory = await prisma.category.findUnique({
        where:{
           name: name
        }
    })

    if(findCategory){
        throw new Error("Category already exist")
    }

    const category = await prisma.category.create({
        data:{
            name,
            createdBy:adminId
        }
    }) 

    return category



}


const getAllCategory = async()=>{

    const findMany = await prisma.category.findMany({
        orderBy:{
            createdAt:"desc"
        },include:{
            admin:{
               select:{
                id:true,
                email:true,
               name:true
               }
        }
    }
})

    return findMany



}



export const categoryService = {
    createCategory,
    getAllCategory
}
