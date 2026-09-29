import express from 'express';
import { processPayment, handlePaymentWebhook } from '../controllers/paymentController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();


router.post('/', protect, processPayment); //using this we are telling express to ca[pture req,res and sed it to processpayment
router.post('/webhook', handlePaymentWebhook);
export default router;