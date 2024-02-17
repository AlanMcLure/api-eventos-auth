import { Router } from "express";

import { getIndex, getEventos, getEventoById, postCart, getCart, deleteCartItem, postCartDecreaseItem, postCartIncreaseItem, getOrders, checkOut } from "../controllers/shopCtrl.js";
import { verifyAuthToken } from "../controllers/authCtrl.js";

export const shopRouter = Router();

shopRouter.get('/', getIndex);
shopRouter.get('/eventos', getEventos);
shopRouter.get('/eventos/:eventoId', getEventoById);
shopRouter.get('/cart', verifyAuthToken, getCart)
shopRouter.post('/add-to-cart', verifyAuthToken, postCart);
shopRouter.delete('/cart/delete-item/:eventoId', verifyAuthToken, deleteCartItem);
shopRouter.post('/cart/increase-item/:eventoId', verifyAuthToken, postCartIncreaseItem);
shopRouter.post('/cart/decrease-item/:eventoId', verifyAuthToken, postCartDecreaseItem);
shopRouter.post('/cart/checkout', verifyAuthToken, checkOut);
shopRouter.get('/orders', verifyAuthToken, getOrders);