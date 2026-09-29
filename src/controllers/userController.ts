import {Request , Response} from 'express'
import prisma from '../config/db'
import { createUserService,loginUserService, findUserById } from '../services/userService';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';


export const registerUser = async (req:Request,res:Response) : Promise<void>=> {
   // taking data that comming from frontend 
   try{


   const newUser = await createUserService(req.body);

   
   res.status(201).json({
    status : ' success',
    message: 'user resgister successfully',
    data   : newUser
   });


}catch(error){
    
    console.error('error in registering user',error);
    
    res.status(500).json({
        status:'error',
        message:'error in registering user'

    });
}

}


//login user services function call 

export const loginUser = async (req:Request,res:Response): Promise<void> => {
    try{
        const  result = await loginUserService(req.body);
        res.status(200).json({
            status:'success',
            message:'login successful',
            data: result
        });

    }catch(error:any){
        res.status(401).json({
            status:"error",
            message:error.message
        });
    }

}




// Protected API
export const getUserProfile = async (req: any, res: any) => {
    const userId =req.user?.userId

    if(!userId){
        res.status(401).json({ 
            status: 'error', 
            message: 'Unauthorized' });
            return;
    }

    const user = await findUserById(userId);

        if (!user) {
            res.status(404).json({ status: 'error', message: 'युजर डेटाबेसमध्ये सापडला नाही!' });
            return;
        }
    res.status(200).json({
        status: 'success',
        message: 'VIP Entry Successful! वेलकम टू प्रोफाईल.',
        data: user 
    });
};