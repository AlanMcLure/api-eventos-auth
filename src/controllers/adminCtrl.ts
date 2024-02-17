import { Request, Response } from "express";
import { Evento } from "../models/Evento.js";
import { Order } from "../models/Orders.js";

export const createEvento = async (req: Request, res: Response) => {
    const { nombreEvento, fechaEvento, lugar, descripcion, precio } = req.body;
    console.log("req.body", req.body)
    try {
        const evento = new Evento(nombreEvento, new Date(fechaEvento), lugar, descripcion, precio);
        await evento.save();
        res.status(201).json({ message: 'Evento creado exitosamente' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateEvento = async (req: Request, res: Response) => {
    const eventoId = req.params.eventoId;
    const { nombreEvento, precio, descripcion, fechaEvento, lugar } = req.body;
    try {
        const updatedEventData = {
            nombreEvento,
            precio,
            descripcion,
            fechaEvento,
            lugar
        };
        const result = await Evento.updateById(eventoId, updatedEventData);
        if (result) {
            res.status(200).json({ message: 'Evento actualizado exitosamente' });
        } else {
            res.status(404).json({ error: `No se encontró ningún evento con el id ${eventoId}` });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteEvento = async (req: Request, res: Response) => {
    const eventoId = req.params.eventoId;
    try {
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        await Evento.deleteById(eventoId);
        res.status(200).json({ message: 'Evento eliminado exitosamente' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.fetchAll();
        res.json({ orders });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}