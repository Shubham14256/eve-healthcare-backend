import prisma from '../config/db';
import { BookingStatus } from '@prisma/client';

export const createBookingWithLock = async (userId: string, testId: string) => {
    //all or nothing 
    return await prisma.$transaction(async (tx) => {
        //row level lock set no one will chnage this util booking done  

        const test = await tx.$queryRaw`
            SELECT id, price FROM "Test" 
            WHERE id = ${testId} 
            FOR UPDATE   
        `;
        //for update for concurrency control ata a timeone whoes request first
        // if no test any

        if (!test || (test as any[]).length === 0) {
            throw new Error("test not exist");
        }

        //save the booking in pending state 
        const newBooking = await tx.booking.create({
            data: {
                userId,
                testId,
                date: new Date(),
                status: 'PENDING', // State Machine 
                // paymentStatus: 'UNPAID' 
            }
        });

        return newBooking;
    });
};

// get the bookings that the user booked
export const getUserBookingsFromDB = async (userId: string) => {

    return await prisma.booking.findMany({

        where: { 
            userId: userId 
        },

        include: {
             //get test data with bookings
            test: {
                include: {
                    centre: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc' 
        }
    });
};


//for updating booking status 

export const updateBookingStatusInDB = async (bookingId: string, newStatus: BookingStatus) => {
    return await prisma.booking.update({
        where: { 
            id: bookingId 
        },
        data: { 
            status: newStatus 
        }
    });
};


// GET ALL bookings for Admin/Pagination
export const getAllBookingsFromDB = async (skip: number, limit: number) => {
    
    const bookings = await prisma.booking.findMany({
        skip: skip,
        take: limit,
        include: {
            
            test: {
                include: {
                    centre: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

   
    const totalBookings = await prisma.booking.count();

    return { bookings, totalBookings };
};