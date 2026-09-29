import { Request, Response } from 'express';

import { AuthRequest } from '../middlewares/authMiddleware';

import { simulatePayment } from '../services/paymentService';

import prisma from '../config/db';

import { BookingStatus, Prisma } from '@prisma/client';


export const processPayment = async (req: AuthRequest, res: Response) => {

    try {

        const { bookingId, amount } = req.body;


        if (!bookingId || !amount) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'bookingId and amount are required' 

            });

        }

        const paymentResult = await simulatePayment(bookingId, amount);

        res.status(200).json({
            status: 'success',
            message: `Payment simulation completed with status: ${paymentResult.status}`,
            data: paymentResult

        });

    } catch (error: unknown) {

        

        if (error instanceof Prisma.PrismaClientKnownRequestError) {

            if (error.code === 'P2002') {
                return res.status(400).json({
                    status: "error",
                    message: "Double payment is not allowed! This booking is already paid."
               
                });

            }
        }


        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
       
        console.error("Payment Error:", errorMessage);


        res.status(500).json({ 
            status: 'error', 
            message: "Something went wrong during payment processing" 
       
        });

    }
};




export const handlePaymentWebhook = async (req: Request, res: Response) => {
    try {
        //background paymnet gate way data 

        const { bookingId, status } = req.body;
        

        if (!bookingId || !status) {

            return res.status(400).json({ error: "Missing required fields" });

        }

        //  Idempotency Check

        const existingBooking = await prisma.booking.findUnique({

            where: { id: bookingId }

        });

        if (!existingBooking) {

            return res.status(404).json({ error: "Booking not found" });

        }

       
        if (
            existingBooking.status === BookingStatus.CONFIRMED || 

            existingBooking.status === BookingStatus.FAILED

        )
         {
            return res.status(200).json({ 
                message: "Webhook already processed earlier. Ignoring duplicate." 
           
           
            });
        }

        
        const newStatus: BookingStatus = status === 'SUCCESS' ? BookingStatus.CONFIRMED : BookingStatus.FAILED;

        
        await prisma.booking.update({
            where: { id: bookingId },

            data: { status: newStatus }

        });


        return res.status(200).json({ 

            message: `Webhook processed successfully. Booking marked as ${newStatus}` 
       
        });

    }
     catch (error: unknown) {

        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
       
        console.error("Webhook Error:", errorMessage);

        return res.status(500).json({ error: "Internal Server Error" });
        
    }
};