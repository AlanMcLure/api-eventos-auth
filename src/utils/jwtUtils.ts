// jwtUtils.ts

import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const generateToken = (_id: string) => {
    console.log('_id:', _id)
    const token = jwt.sign({ _id }, 'tu_secreto_aqui', { expiresIn: '1h' });
    return token;
};


export const verifyToken = (token: string): any | null => {
    try {
        const decoded = jwt.verify(token, 'tu_secreto_aqui');
        return decoded;
    } catch (error) {
        return null; // Token inválido
    }
};