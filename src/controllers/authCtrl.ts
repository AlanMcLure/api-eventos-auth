// authCtrl.ts

import { NextFunction, Request, Response } from 'express';
import { generateToken, verifyToken } from '../utils/jwtUtils.js';
import { authenticateUser } from '../services/authService.js';
import { User } from '../models/User.js';

interface CustomRequest<T = Record<string, any>> extends Request {
    user?: User; // Define la propiedad 'user' de tipo 'User'
}

export const login = async (req: Request, res: Response) => {
    try {
        // Lógica para autenticar al usuario
        const user = await authenticateUser(req.body.username, req.body.password);

        // Si las credenciales son válidas, generar token JWT
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
    // Cerrar la sesión del usuario destruyendo la sesión
    req.session.destroy((err) => {
        if (err) {
            // Si hay un error al destruir la sesión, responder con un mensaje de error
            res.status(500).json({ error: 'Error al cerrar sesión' });
        } else {
            // Si la sesión se destruye correctamente, responder con un mensaje de éxito
            res.status(200).json({ message: 'Sesión cerrada exitosamente' });
        }
    });
};

export const verifyAuthToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extrae el token del encabezado de autorización
    if (token) {
        const decodedToken = verifyToken(token); // Verifica el token JWT
        if (decodedToken) {
            try {
                // Recupera el usuario correspondiente al ID de usuario incluido en el token
                console.log('decodedToken id:', decodedToken._id);
                const user = await User.fetchById(decodedToken._id);
                if (user) {
                    // Intenta crear manualmente una instancia de User
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
                        // Adjunta el usuario recuperado al objeto de solicitud (req)
                        req.user = userInstance;
                        next(); // Continúa con el siguiente middleware o controlador
                    } else {
                        // Si no se puede encontrar el usuario correspondiente, devuelve un error genérico
                        res.status(401).json({ error: 'Error de autenticación' });
                    }
                }
            } catch (error) {
                // Manejo de errores al buscar el usuario en la base de datos
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
    console.log('Rol del usuario:', req.user?.role);
    console.log('Usuario:', req.user);
    if (req.user && req.user.role === 'admin') {
        next(); // El usuario es un administrador, por lo que se puede continuar con el siguiente middleware o controlador
    } else {
        res.status(403).json({ error: 'Se requiere ser administrador' }); // El usuario no es un administrador, por lo que se envía un error
    }
};