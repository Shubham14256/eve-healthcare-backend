import {Request ,Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';

// what include betweein the pass 
interface jwtPayload {
    userId : string,
    role   : string 

} 

// we have to create new child of express request so we are using interface here to create new auth class for user authh request 
export interface AuthRequest extends Request{
    user ? : jwtPayload  // contains only user id and role so 
}


//main middleware logic here 

export const protect = (req:AuthRequest,res:Response,next : NextFunction) => {
    let token

    //checking authrization=> lable (Envelope) and bearer=> type of content like jwt or any else 
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        try{
            //from Bearer seprate the actual token 
            token = req.headers.authorization.split(' ')[1];

            // open actual jwt token to verify it is real ? 
            const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as jwtPayload;

            //pass real then store the infomationin user box

            req.user= decoded
            
            //everything ok then gurd give permissin to go to controller 

            return next();


        }catch(error){
            res.status(401).json({
                 status :'error',
                 message:'your token is not valid '

            });
            return;
           
        }
    }
    // the user does not contain address means does not contain authorization in headers 
    if(!token){
        res.status(401).json({
            status :'error',
            message:'please login first'
        });
        return;
    }
};