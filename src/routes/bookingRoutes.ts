import express from 'express';
import { createBooking , getMyBookings , updateBookingStatus, getAllBookings } from '../controllers/bookingController';
import { protect } from '../middlewares/authMiddleware'; 
//checking authenticationfor no booking without login 
const router = express.Router();

//  Protected Route for booking
router.post('/', protect, createBooking,);

//protected route for fetching bookings

router.get('/', protect, getMyBookings);

// update booking status 

router.patch('/:id/status', protect, updateBookingStatus);

router.get('/', protect ,getAllBookings);


export default router;