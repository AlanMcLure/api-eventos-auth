### Api-eventos

Api-eventos es una API RESTful construida con Node.js y Express, diseñada para gestionar eventos. Esta API permite a los usuarios iniciar sesión, ver eventos, agregarlos al carrito y hacer pedidos. Los usuarios pueden tener uno de los dos roles: `user` o `admin`. Los usuarios con el rol `admin` tienen permisos adicionales, como la capacidad de administrar los eventos y la de ver todos los pedidos. La API utiliza JWT y express-session para la autenticación, y cors para permitir el intercambio de recursos de origen cruzado. También se proporcionan dos usuarios de prueba para facilitar las pruebas.

## Requisitos

- Node.js
- npm
- MongoDB

## Instalación

Primero, clona el repositorio:

```bash
git clone https://github.com/AlanMcLure/api-eventos.git
cd repo
```

Luego, instala las dependencias:

```bash
npm install
```

## Configuración

Crea un archivo .env en la raíz del proyecto (basate en el archivo env.example):

```bash
PORT=3001
DB_CONN_STRING="mongodb://127.0.0.1:27017"
DB_NAME="practica-eventos"
USER_COLLECTION="users"
EVENTO_COLLECTION="eventos"
ORDER_COLLECTION="orders"
JWT_SECRET="patatas"
```

## Uso

```bash
npm run mongo
npm run build
npm start
```

## Implementaciones

Este proyecto incluye las siguientes implementaciones:

- **Autenticación**: Se utiliza `jsonwebtoken` (JWT) y `express-session` para manejar la autenticación de los usuarios. Cuando un usuario inicia sesión, se genera un token JWT que se almacena en una cookie de sesión.

- **Roles de usuario**: Hay dos roles de usuario implementados, `user` y `admin`. Los usuarios con el rol `admin` tienen permisos adicionales, como la capacidad de administrar eventos y ver los pedidos de todos los usuarios.

- **CORS**: Se utiliza la biblioteca `cors` para habilitar el intercambio de recursos de origen cruzado (CORS), lo que permite que la API sea utilizada desde diferentes orígenes.

## Pruebas

Para probar la API, puedes utilizar la colección de peticiones que se encuentra en la carpeta `docs`. Para hacerlo, sigue estos pasos:

1. Abre Thunder Client en Visual Studio Code.
2. Ve a la sección de Collections.
3. Haz clic en "Import" en el menú.
4. Navega hasta la carpeta `docs` de este proyecto y selecciona el archivo de la colección.

Ahora deberías ver la colección de peticiones en Thunder Client y podrás ejecutarlas para probar la API.

## Usuarios de Prueba

Al iniciar la aplicación, se crean automáticamente dos usuarios de prueba:

- **Usuario normal**: El nombre de usuario es `mateo` y la contraseña es `mateo`.
- **Usuario admin**: El nombre de usuario es `admin` y la contraseña es `admin`.

Puedes utilizar estos usuarios para probar las funcionalidades de la aplicación.