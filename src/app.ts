import express, { urlencoded, json } from "express";
import session from 'express-session';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { connectToDatabase } from "./services/databaseService.js";
import { User } from "./models/User.js";
import { adminRouter } from "./routes/adminRoutes.js";
import { shopRouter } from "./routes/shopRoutes.js";
import { authRouter } from "./routes/authRoutes.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

// Habilitar CORS
app.use(cors());

app.use(session({
    secret: process.env.JWT_SECRET || 'default_secret', // Secreto para firmar la cookie de sesión
    resave: false, // Evitar que la sesión se guarde de nuevo en el almacenamiento si no hay cambios
    saveUninitialized: false // Evitar guardar una sesión vacía
}));

// Middleware para procesar campos que se envíen por HTTP (body-parser)
app.use(urlencoded({ extended: false }));
app.use(json());

// Desactivar la cabecera X-Powered-By
app.disable('x-powered-by');

// Rutas del administrador
app.use('/admin', adminRouter);

// Rutas de la tienda
app.use('/', shopRouter);

// Rutas de autenticación
app.use('/auth', authRouter);

// Iniciar el servidor
connectToDatabase()
    .then(async () => {
        const user = new User('mateo', 'mateo', '123456789', 'Mateo', 'mateo@a.com', { calle: 'a', telf: '555', CP: '46000' });
        await user.save();

        const admin = new User('admin', 'admin', '987654321', 'Admin', 'admin@a.com', { calle: 'b', telf: '777', CP: '46001' }, [], undefined, 'admin');
        await admin.save();
    })
    .then(() => {
        console.log('Conexión a la base de datos exitosa');
        app.listen(port, () => {
            console.log(`Servidor de la app en marcha. API disponible en: http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar a la base de datos:", error);
    });

