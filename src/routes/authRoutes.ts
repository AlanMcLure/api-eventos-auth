// authRoutes.ts

import { Router } from 'express';
import { login, logout } from '../controllers/authCtrl.js';

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/logout', logout);
