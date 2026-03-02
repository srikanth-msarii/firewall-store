import express from 'express';
import { registerAdmin, loginAdmin, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

export default router;