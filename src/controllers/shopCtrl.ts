import { Request as ExpressRequest } from "express";
import { Request, Response, NextFunction } from "express";
import { Evento } from "../models/Evento.js";
import { User } from "../models/User.js";

export interface CustomRequest<T = Record<string, any>> extends Request {
  user?: User;
}

export const getIndex = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Bienvenido a la API de eventos' });
};

export const getEventos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventos = await Evento.fetchAll();
    res.json({ eventos });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventoById = async (req: Request, res: Response, next: NextFunction) => {
  const eventoId = req.params.eventoId;
  try {
    const evento = await Evento.findById(eventoId);
    if (evento) {
      res.json({ evento });
    } else {
      res.status(404).json({ message: 'Evento no encontrado' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCart = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  try {
    const items = await user?.getCart();
    res.json({ items });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const postCart = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  const eventoId = req.body.eventoId;
  const evento = await Evento.findById(eventoId);
  if (!evento) {
    return res.status(404).json({ message: 'Evento no encontrado' });
  }
  try {
    if (user instanceof User) {
      await user.addToCart(eventoId);
      res.status(201).json({ message: 'Evento añadido al carrito' });
    } else {
      res.status(401).json({ message: 'Usuario no autenticado' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCartItem = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  const eventoId = req.params.eventoId;
  const evento = await Evento.findById(eventoId);
  if (!evento) {
    return res.status(404).json({ message: 'Evento no encontrado' });
  }
  try {
    if (user instanceof User) {
      await user.deleteCartItem(eventoId);
      res.status(200).json({ message: 'Evento eliminado del carrito' });
    } else {
      res.status(401).json({ message: 'Usuario no autenticado' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const postCartIncreaseItem = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  const eventoId = req.params.eventoId;
  const evento = await Evento.findById(eventoId);
  if (!evento) {
    return res.status(404).json({ message: 'Evento no encontrado' });
  }
  try {
    if (user instanceof User) {
      await user.addToCart(eventoId);
      res.status(201).json({ message: 'Cantidad incrementada' });
    } else {
      res.status(401).json({ message: 'Usuario no autenticado' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const postCartDecreaseItem = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  const eventoId = req.params.eventoId;
  const evento = await Evento.findById(eventoId);
  if (!evento) {
    return res.status(404).json({ message: 'Evento no encontrado' });
  }
  try {
    await user?.decreaseCartItem(eventoId);
    res.status(201).json({ message: 'Cantidad decrementada' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  try {
    const orders = await user?.getOrders();
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const checkOut = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  try {
    const result = await user?.addOrder();
    if (result) {
      res.status(201).json({ message: "Pedido hecho", order: result });
    } else {
      res.status(400).json({ message: "Error en el pedido" });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Error al procesar la orden" });
  }
}