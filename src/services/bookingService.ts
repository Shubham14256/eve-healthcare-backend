import { BookingStatus } from '@prisma/client';
import { createBookingWithLock, getUserBookingsFromDB, updateBookingStatusInDB , getAllBookingsFromDB } from '../repositories/bookingRepository';


export const processBooking = async (userId: string, testId: string) => {
    if (!testId || !userId ) {
        throw new Error("please slect the test name");
    }

    
      // logic for creatingthebooking saying to bookingrepository file
    const booking = await createBookingWithLock(userId, testId);
    
    return booking;
};


//fetchingthe bookings 

export const fetchUserBookings = async (userId: string) => {
    
    const bookings = await getUserBookingsFromDB(userId);
    return bookings;
};



//update booking status 

export const updateBookingState = async (bookingId: string, newStatus: BookingStatus) => {
    // State Machine Security only this 3 states

    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];
    
    if (!validStatuses.includes(newStatus)) {

        throw new Error(`Invalid status! Only ${validStatuses.join(', ')} are allowed.`);

    }


    // everthing ok then only update in database 
    const updatedBooking = await updateBookingStatusInDB(bookingId, newStatus);
   
    return updatedBooking;
};


// Fetch ALL bookings with Pagination (For Admin)

export const fetchAllBookings = async (page: number, limit: number) => {
    // Kiti records skip karayche te calculate karne
    const skip = (page - 1) * limit;
    
    // get data 
    const { bookings, totalBookings } = await getAllBookingsFromDB(skip, limit);
    
    // Meta data return 
    return {
        bookings,
        meta: {
            totalBookings,
            totalPages: Math.ceil(totalBookings / limit),
            currentPage: page,
            limit
        }
    };
};