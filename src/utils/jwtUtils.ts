import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const generateToken = (_id: string) => {
    console.log('_id:', _id)
    const token = jwt.sign({ _id }, JWT_SECRET, { expiresIn: '1h' });
    return token;
};


export const verifyToken = (token: string): any | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null; // Token inválido
        //      throw new Error('Error al verificar el token');
    }
};