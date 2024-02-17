import { User } from "../models/User.js";

export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
    try {
        const user = await User.fetchUserByUsernameAndPassword(username, password);
        if (!user) {
            console.log('Credenciales inválidas')
            return null;
        }
        return user;
    } catch (error) {
        console.error('Error al autenticar al usuario:', error);
        throw error;
    }
};