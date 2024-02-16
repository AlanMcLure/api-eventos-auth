import { Request, Response } from "express";
import { Evento } from "../models/Evento.js";

/* export const getEventos = async (req: Request, res: Response) => {
    try {
        const eventos = await Evento.fetchAll();
        res.json({ eventos });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}; */

/* export const getAddEvento = (req: Request, res: Response) => {
    console.log("Devolvemos el formulario para agregar eventos");
    res.render('admin/edit-evento', { pageTitle: "Formulario de Evento", path: "/admin/add-evento", editing: false });
}; */

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

/* export const getEditEvento = async (req: Request, res: Response) => {
    console.log("getEditEvento: Devolvemos el formulario para editar eventos");
    const editMode = req.query.edit === 'true';
    if (!editMode) {
        return res.redirect('/eventos');
    }
    const eventoId = req.params.eventoId;
    const evento = await Evento.findById(eventoId);
    if (evento) {
        res.render('admin/edit-evento', {
            pageTitle: "Formulario de Edición de Evento",
            path: "/admin/edit-evento",
            editing: editMode,
            evento: evento
        });
    } else {
        res.redirect('/eventos');
    }
}; */

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
        await Evento.deleteById(eventoId);
        res.status(200).json({ message: 'Evento eliminado exitosamente' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
