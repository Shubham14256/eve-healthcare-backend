import { createPaymentRecord } from '../repositories/paymentRepository';
import { updateBookingStatusInDB } from '../repositories/bookingRepository';
import { PaymentStatus, BookingStatus } from '@prisma/client';

export const simulatePayment = async (bookingId: string, amount: number) => {
    
    // RANDOM TRANSACTION ID GENARATE USING MILI SECOND CALCULATOR SO UNIQUE ID GENERATE HERE 
    
    const transactionId = `txn_${Date.now()}`;

    //  Simulated Payment Logic 
    const isSuccess = Math.random() > 0.2; 
    const paymentStatus: PaymentStatus = isSuccess ? 'SUCCESS' : 'FAILED';
    
    
    const newBookingStatus = (isSuccess ? 'CONFIRMED' : 'FAILED') as BookingStatus;
    //  Save the Payment In database
    const payment = await createPaymentRecord(bookingId, amount, transactionId, paymentStatus);

    // NEW BOOKING STATUS UPDATE 
    await updateBookingStatusInDB(bookingId, newBookingStatus);

    return payment;
};