import { Router } from "express";

import { getIndex, getEventos, getEventoById, postCart, getCart, deleteCartItem, postCartDecreaseItem, postCartIncreaseItem, getOrders, getCheckOut } from "../controllers/shopCtrl.js";
import { verifyAuthToken } from "../controllers/authCtrl.js";

export const shopRouter =  Router();

//Usamos get y por lo tanto exige coincidencia "completa", no capa otras rutas
shopRouter.get('/',getIndex);
shopRouter.get('/eventos',getEventos);
shopRouter.get('/eventos/:eventoId',getEventoById);
shopRouter.get('/cart', verifyAuthToken, getCart)
shopRouter.post('/add-to-cart', verifyAuthToken, postCart);
shopRouter.post('/cart/delete-item/:eventoId', verifyAuthToken, deleteCartItem);
shopRouter.post('/cart/increase-item/:eventoId', verifyAuthToken, postCartIncreaseItem);
shopRouter.post('/cart/decrease-item/:eventoId', verifyAuthToken, postCartDecreaseItem);
shopRouter.get('/checkout', verifyAuthToken, getCheckOut);
shopRouter.get('/orders', verifyAuthToken, getOrders);
// shopRouter.get('/saludo', getSaludo);
