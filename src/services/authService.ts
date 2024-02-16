// authService.ts

import { User } from "../models/User.js";

export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
    // Aquí iría la lógica de autenticación
    // Por ejemplo, buscar el usuario en la base de datos y verificar la contraseña
    console.log('username:', username);
    console.log('password:', password);
    
    // Por ahora, retornamos un usuario ficticio si las credenciales son correctas
        const user = await User.fetchUserByUsernameAndPassword(username, password);
        if (!user) {
            console.log('Credenciales inválidas')
            return null;
        }
        return user;
};

// Otras funciones relacionadas con la autenticación
