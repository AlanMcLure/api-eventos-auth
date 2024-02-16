import { Router } from "express";

import { createEvento, updateEvento, deleteEvento } from "../controllers/adminCtrl.js";

export const adminRouter = Router();



//todas las rutas que llegan aquí empiezan por /admin

/* adminRouter.get('/eventos',getEventos); */
adminRouter.post('/add-evento',createEvento);
adminRouter.put('/edit-evento/:eventoId', updateEvento);
adminRouter.delete('/delete/:eventoId', deleteEvento);
