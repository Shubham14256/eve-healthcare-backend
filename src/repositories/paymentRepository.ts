import { PrismaClient, PaymentStatus } from '@prisma/client';
const prisma = new PrismaClient();

export const createPaymentRecord = async (bookingId: string, amount: number, transactionId: string, status: PaymentStatus) => {
    return await prisma.payment.create({
        
        data: {
            bookingId: bookingId,
            amount: amount,
            transactionId: transactionId,
            status: status
        }
    });
};