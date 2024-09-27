import express from 'express';
import { loginUser, registerUser, logoutUser,sentOtp, verifyOtp  } from '../controllers/user.js';

const router = express.Router();



router.post("/register",registerUser);
router.post("/login",loginUser)
router.post("/logout", logoutUser)
router.post("/sentOtp", sentOtp)
router.post("/verifyOtp", verifyOtp)



export default router