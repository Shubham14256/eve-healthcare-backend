import {Request,Response,NextFunction} from 'express';
import { ZodSchema , ZodError} from 'zod';  // we can use zod validation forn anything 

export const validate = (schema:ZodSchema) =>{
    return async ( req:Request, res:Response, next:NextFunction ): Promise<void>=> {

        try{
            await schema.parseAsync(req.body);// check the user data with rule book 

            // everthing ok then send to controller 
            next();

        }catch(error:any){
            if (error instanceof ZodError){ 
                 // for checking the error is of zod or not 
            res.status(400).json({
                status:'error',
                message:error.issues[0].message // zod wll give autometically error like password of minimum 7 char like this 
            });

          }else {
                res.status(500).json({
                    status: 'error',
                    message: '(Internal Server Error)'
                });
            }

        }

    }

}
