// authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest<T = Record<string, any>> extends Request {
    user?: any; // Define la propiedad 'user' de tipo 'any' o del tipo que necesites
}

const requireAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Token de acceso no proporcionado' });
    }

    jwt.verify(token, 'tu_secreto_aqui', (err: any, decodedToken: any) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        } else {
            req.user = decodedToken; // Adjunta la información del usuario al objeto de solicitud (req)
            next();
        }
    });
};

export default requireAuth;
