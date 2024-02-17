import { NextFunction, Request, Response } from 'express';
import { generateToken, verifyToken } from '../utils/jwtUtils.js';
import { authenticateUser } from '../services/authService.js';
import { User } from '../models/User.js';

interface CustomRequest<T = Record<string, any>> extends Request {
    user?: User;
}

export const login = async (req: Request, res: Response) => {
    try {
        const user = await authenticateUser(req.body.username, req.body.password);

        if (user) {
            const token = generateToken(user._id ? user._id?.toString() : '');
            res.json({ message: 'Autenticación exitosa', token });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error de autenticación:', error);
        res.status(500).send('Error de autenticación');
    }
};

export const logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ error: 'Error al cerrar sesión' });
        } else {
            res.status(200).json({ message: 'Sesión cerrada exitosamente' });
        }
    });
};

export const verifyAuthToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extrae el token del encabezado de autorización
    if (token) {
        const decodedToken = verifyToken(token);
        if (decodedToken) {
            try {
                const user = await User.fetchById(decodedToken._id);
                if (user) {
                    const userInstance = new User(
                        user.username,
                        user.password,
                        user.DNI,
                        user.name,
                        user.mail,
                        user.contacto,
                        user.cart,
                        user._id?.toString(),
                        user.role
                    );
                    if (userInstance instanceof User) {
                        req.user = userInstance;
                        next(); // Continúa con el siguiente middleware o controlador
                    } else {
                        res.status(401).json({ error: 'Error de autenticación' });
                    }
                }
            } catch (error) {
                console.error('Error al buscar el usuario:', error);
                res.status(500).json({ error: 'Error de autenticación' });
            }
        } else {
            res.status(401).json({ error: 'Token inválido' });
        }
    } else {
        res.status(401).json({ error: 'Token de autorización no proporcionado' });
    }
};

export const requireAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next(); // El usuario es un administrador, por lo que se puede continuar con el siguiente middleware o controlador
    } else {
        res.status(403).json({ error: 'Se requiere ser administrador' }); // El usuario no es un administrador, por lo que se envía un error
    }
};