import express from 'express';
const router = express.Router();
import { registerAdmin, loginUser } from '../controllers/authController.js';

// // /api/auth/register
// router.post('/register', registerAdmin);

// /api/auth/login
router.post('/login', loginUser);

export default router;