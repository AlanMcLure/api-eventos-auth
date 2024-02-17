// authRoutes.ts

import { Router } from 'express';
import { login, logout } from '../controllers/authCtrl.js';

export const authRouter = Router();

//todas las rutas que llegan aquí empiezan por /auth

authRouter.post('/login', login);
authRouter.post('/logout', logout);
