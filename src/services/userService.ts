import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { is } from 'zod/v4/locales';
import { finduserByIdInDb,findUserByEmailInDB, createUserInDB } from '../repositories/userRepository';




export const createUserService = async(userData: any)=>{
    
    const { name, email,password,role} = userData; 

    const existingUser = await findUserByEmailInDB(email);


   if(existingUser){
    throw new Error('this email is alrady register');
   }



   // hashing the password for security 

   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password,salt);



   
   // save the database 


   const newUser = await createUserInDB({
       
            name,
            email,
            password: hashedPassword,
            role: role || 'PATIENT'
        
    });
    
    const {password:_, ...userWithoutPassword} = newUser;
    return userWithoutPassword;



}


// login user 

export const loginUserService = async(loginData:any) => {
    const {email,password} = loginData;

    //check the user is in database
   const user = await findUserByEmailInDB(email);
    if(!user){
        throw new Error('user not register please register');

    }

    //check the database password and user password is match ?
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        throw new Error('entered password is incorrect');

    }

    //password correct then create digital token of json 
    const token= jwt.sign(
        {userId : user.id, role:user.role}, // hide the id and role in token payload to verify user from their pass or token 
        process.env.JWT_SECRET as string,   //env key as string for not giving error or promising the typescript that in .env there is deffinetly onestromg of token so typescript allow code to go forward
        { expiresIn: '1d' }                   // token will valid for oneday 

    );

    //send the reaming data and token by hiding password 
    const {password:_,...userWithoutPassword} = user;
    return{
        userWithoutPassword,
        token
    };

};

export const findUserById = async (userId: string) => {
    const user = await finduserByIdInDb(userId);
    return user;
};

