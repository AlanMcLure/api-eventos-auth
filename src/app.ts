/* import express, {urlencoded} from "express";
import * as dotenv from 'dotenv';

import { User } from "./models/User.js";
import { rutas } from "./utils/rutas.js";
import { adminRouter } from "./routes/adminRoutes.js";
import { shopRouter } from "./routes/shopRoutes.js";
import { collections, connectToDatabase } from "./services/databaseService.js";

console.log('------------------------------------------------------------_---');
console.log("Bienvenido a mi app");
dotenv.config();

const port =  process.env.PORT || 3000;

const app = express();

connectToDatabase()
.then( async () => 
{
    const user = new User('123456789', 'Mateo', 'mateo@a.com',{calle: 'a', telf: '555', CP: '46000'});
    await user.save();
})
.then( () => {
    console.log('Funciona');

    app.use(urlencoded({extended: false})); //Middleware para procesar los campos que me envíen por HTTP body-parser
    app.use(express.static(rutas.public)); //Mia rutas contenido estáticos .css .js
    app.disable('x-powered-by');
    app.set('view engine', 'ejs');
    app.set('views',rutas.views); 
    app.use(
        //Este middleware simula que se ha loggeado un usuario
        //Este es el usuario que se utilizará en los métodos de la tienda. En el futuro se sustituirá con el proceso de login
        async (req, res, next) => {
            const user = await collections.users?.findOne({'DNI': '123456789'});
            req.body.user = new User(user!.DNI,user!.name, user!.mail, user!.contacto, user!.cart, user!._id.toHexString()); 
            next();  
        }
    );

    app.use('/admin', adminRouter); //Las rutas empiezan por /admin
    app.use('/', shopRouter);
    //Controladores para responder a las peticiones por HTTP


    app.use('/', (req,res,next)=> {
        console.log("Middleware del final");
        res.render('404.ejs',{pageTitle: "Págnia no encontrada", path: ""});
    })

    // FIN 
    app.listen(port);
    console.log("Servidor de la app en marcha");
    console.log(`Página disponible en: http://localhost:${port}`);

} )
.catch( (error)=> {
    console.log(error);
})

console.log(' ---- FIN del Programa -----'); */

import express, { urlencoded, json, Request, Response, NextFunction } from "express";
import session from 'express-session';
import * as dotenv from 'dotenv';
import { collections, connectToDatabase } from "./services/databaseService.js";
import { User } from "./models/User.js";
import { adminRouter } from "./routes/adminRoutes.js";
import { shopRouter } from "./routes/shopRoutes.js";
import { authRouter } from "./routes/authRoutes.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(session({
    secret: 'tu_secreto_aqui', // Secreto para firmar la cookie de sesión
    resave: false, // Evitar que la sesión se guarde de nuevo en el almacenamiento si no hay cambios
    saveUninitialized: false // Evitar guardar una sesión vacía
}));

// Middleware para procesar campos que se envíen por HTTP (body-parser)
app.use(urlencoded({ extended: false }));
app.use(json());

// Middleware de registro para verificar el cuerpo de la solicitud
app.use((req, res, next) => {
    console.log("Cuerpo de la solicitud:", req.body);
    next();
});

// Desactivar la cabecera X-Powered-By
app.disable('x-powered-by');

// Interfaz extendida para agregar la propiedad user al objeto de solicitud (req)
interface CustomRequest extends Request {
    user?: User;
}

// Middleware para simular inicio de sesión de usuario
app.use(async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        // Simular la autenticación del usuario usando un DNI predeterminado
        const user = await collections.users?.findOne({ 'DNI': '123456789' });

        // Adjuntar el usuario autenticado al objeto de solicitud (req)
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        req.user = user;

        // Llamar a la siguiente función de middleware en la cadena
        next();
    } catch (error) {
        // Manejar errores si la autenticación falla
        console.error("Error de autenticación:", error);
        res.status(500).send("Error de autenticación");
    }
});

// Rutas del administrador
app.use('/admin', adminRouter);

// Rutas de la tienda
app.use('/', shopRouter);

app.use('/auth', authRouter);

// Iniciar el servidor
connectToDatabase()
    .then(() => {
        console.log('Conexión a la base de datos exitosa');
        app.listen(port, () => {
            console.log(`Servidor de la app en marcha. API disponible en: http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar a la base de datos:", error);
    });

