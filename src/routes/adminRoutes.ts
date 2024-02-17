import { Router } from "express";

import { createEvento, updateEvento, deleteEvento, getAllOrders } from "../controllers/adminCtrl.js";
import { verifyAuthToken, requireAdmin } from "../controllers/authCtrl.js";

export const adminRouter = Router();

//todas las rutas que llegan aquí empiezan por /admin

adminRouter.post('/add-evento', verifyAuthToken, requireAdmin, createEvento);
adminRouter.put('/edit-evento/:eventoId', verifyAuthToken, requireAdmin, updateEvento);
adminRouter.delete('/delete/:eventoId', verifyAuthToken, requireAdmin, deleteEvento);
adminRouter.get('/orders', verifyAuthToken, requireAdmin, getAllOrders);
