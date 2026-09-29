import { Router } from "express";
import { registerUser,loginUser,getUserProfile } from "../controllers/userController";
import { protect } from '../middlewares/authMiddleware';

//import utils rule book and import middleware of validators
import { validate } from '../middlewares/validateRequest';   //dok utils ch logic middlewares ch for reusability 
import { registerSchema, loginSchema } from '../utils/validators'

 

const router = Router();


// when post request come run registeruser function 
router.post('/register', validate( registerSchema ) , registerUser );
router.post('/login', validate( loginSchema ), loginUser );

// profile not need of zod it has auth and proctect bouncer
router.get('/profile', protect, getUserProfile);

export default router;
