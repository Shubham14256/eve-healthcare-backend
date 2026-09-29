import dotenv from 'dotenv';
import app from './app';

dotenv.config();


const PORT = process.env.PORT || 8000;



const start_Server = () => {
    try{
        const server = app.listen(PORT, () =>{
           console.log(`Server is Running On ${PORT}`);
        });


        //SIGINT Signal Interupt  ======== GRACEFUL SHUTDOWN =======


        process.on('SIGINT', () =>{
            console.log('Server is gracefully shutting down...')


        server.close(() => {
            console.log('Process terminated.');
            process.exit(0);                          // 0 mhanje kontahi error nasatana clean exit ghene.
        });
        
        });

                                                          // pan jya patients che payments/bookings already chalu ahet te purna houn de."
       



       }catch(error){
                                                         // Tya crash la ithe catch kela jato.
        console.error('❌ Failed to start server:', error);
        process.exit(1);

}
};

start_Server();