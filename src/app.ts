//blue print of server
import express, {Application,Request,Response} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import prisma from './config/db';
import userRoutes from './routes/userRoutes'
import bookingRoutes from './routes/bookingRoutes';
import paymentRoutes from './routes/paymentRoutes';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';



//instance of express 
const app : Application = express();




const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min window only 
    max: 100, // max 100 requests
    standardHeaders: true, 
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
});


//morgan for terminal 
app.use(morgan('dev'));

app.use('/api', apiLimiter); // apply on all api routes 

//middlewares

app.use(helmet());             // hide the url express or backend identity 
app.use(cors());              // cros origin request allow for ronted request port and backend communication 
app.use(express.json());     // for reading data in form of json 


// ================= ROUTES =================

app.use('/api/users',userRoutes);

app.use('/api/bookings', bookingRoutes);

app.use('/api/payments', paymentRoutes);

  



app.get('/health',(req:Request, res:Response) => {
    res.status(200).json({
        status: 'success',
        message: 'EVE HealthCare API Running Smoothly',
        timestamp: new Date().toISOString() //todays date 
    });

});




//==== data base testing api 

app.get('/test-db', async(req:Request, res : Response ) => {

    try{
    // find all user in database 
    const allUsers = prisma.user.findMany();

    res.status(200).json({
        status : 'success',
        message: 'Database Connected Successfully',
        data   :  allUsers
    })

    }catch(error){
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Database Query Failed'
        });
    }



app.use(( req:Request , res:Response) => {
    res.status(404).json({
        error:'Route not found'
    });

   });

});



export default app;
