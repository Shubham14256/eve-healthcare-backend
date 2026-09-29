import { Request, Response } from 'express';
import { processBooking, fetchUserBookings, updateBookingState, fetchAllBookings } from '../services/bookingService';
import { AuthRequest } from '../middlewares/authMiddleware';




export const createBooking = async (req: AuthRequest, res:  Response) => {

    try {
        // extract the id from token which is set by auth middleware
        const userId = req.user?.userId; //user eexits then go between not then dont scratch the ? so condition otional extract userId from loginservices

        const { testId } = req.body;
        
        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'please login first' });
        }


        // give work to service
        const newBooking = await processBooking(userId, testId);

        res.status(201).json({
            status: 'success',
            message: 'booking success in  pending state',
            data: newBooking
        });


    }catch (error: any) {

        console.error("Booking Error:", error.message);

        res.status(400).json({
            status: 'error',
            message: error.message

        });
    }
};



//fetching bookings 

export const getMyBookings = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'please login first' });
        }

       // tell service to take data
        const myBookings = await fetchUserBookings(userId);

        res.status(200).json({
            status: 'success',
            results: myBookings.length,
            data: myBookings
        });
    } catch (error: any) {
        console.error("Fetch Bookings Error:", error.message);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};



//update booking 
export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
    try {

        // extract id from booking url 
        const { id } = req.params as { id: string };  ;

        // new status from body 
        const { status } = req.body; 

        if (!status) {
            return res.status(400).json({ status: 'error', message: 'Status is required' });
        }

        const updatedBooking = await updateBookingState(id, status);


        res.status(200).json({
            status: 'success',
            message: `Booking successfully updated to ${status} `,
            data: updatedBooking
            
        });

    } 
    catch (error: any) {
        console.error("Update Status Error:", error.message);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};


//fetching all bookings for admin

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        const result = await fetchAllBookings(page, limit);

        res.status(200).json({
            status: 'success',
            data: result.bookings,
            meta: result.meta
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch bookings' });
    }
};