import {email, z} from 'zod'


//registration rule book only tools

export const registerSchema = z.object({
    name     : z.string().min(2,'name should br atleast 2 characters'),
    email    : z.string().email('email should be valid'),
    password: z.string().min(7,"atleast 7 char and strong password"),
    role      : z.enum(['ADMIN', 'PATIENT','DOCTOR']).optional()


}) ;

//RULEBOOK for login 

export const loginSchema = z.object({
    email: z.string().email('enter valid email'),
    password:z.string().min(7,'password should contain atleast 7 characters')
});