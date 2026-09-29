import prisma from "../config/db";

// saving the new user in database (Create)
export const createUserInDB = async (userData: any) => {
    return await prisma.user.create({
        data: userData
    });
};



//finding user by emailid

export const findUserByEmailInDB = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email }
    });
};


//find user byId

export const finduserByIdInDb = async(userId:string) => {
    return await prisma.user.findUnique({
        where:{id:userId}, //matching userid with actual id 
        select:{
            id       : true,
            name     : true,
            email    : true,
            role     : true,
            createdAt: true
        }


    });
}


