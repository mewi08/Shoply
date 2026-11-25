# Backend Shoply

Este proyecto es el backend de Shoply, una aplicación para gestionar los procesos de una tienda: tiendas, usuarios, productos, marcas, categorías, unidades de medida, lotes, clientes y ventas.

## Requisitos

- Node.js (versión LTS recomendada)
- XAMPP (MySQL / MariaDB)
- npm

## Tecnologías

- **Express 5**: servidor y rutas de la API.
- **Knex.js**: constructor de consultas, migraciones y seeds.
- **mysql2**: driver de MySQL.
- **jsonwebtoken** y **cookie-parser**: autenticación con token guardado en cookie.
- **bcryptjs**: cifrado de contraseñas.
- **helmet**: cabeceras de seguridad HTTP.
- **express-rate-limit**: límite de peticiones para proteger el inicio de sesión y las rutas públicas.
- **dotenv**: variables de entorno desde un archivo `.env`.

## Instalación

1. Entra a la carpeta del backend e instala las dependencias:

   ```bash
   cd backend
   npm install
   ```

2. Inicia XAMPP y activa **MySQL** desde el panel de control.

3. Crea la base de datos `shoply` (desde phpMyAdmin o la consola de MySQL).

4. Configura la conexión a la base de datos y las demás variables del proyecto (por ejemplo, la clave para firmar los tokens). En XAMPP, por defecto el usuario es `root` sin contraseña. Revisa `src/shared/config/db.js` y el archivo `.env` si lo usas.

5. Crea las tablas con las migraciones:

   ```bash
   npm run migrate
   ```

6. (Opcional) Carga datos de prueba con los seeds:

   ```bash
   npm run seed
   ```

7. Inicia el servidor:

   ```bash
   npm run dev
   ```

   `dev` reinicia el servidor automáticamente al cambiar archivos. Para producción usa `npm start`.

## Scripts

| Script | Comando | Descripción |
|---|---|---|
| `npm start` | `node src/server.js` | Inicia el servidor. |
| `npm run dev` | `node --watch src/server.js` | Inicia el servidor y lo reinicia al guardar cambios. |
| `npm run migrate` | `knex migrate:latest` | Crea o actualiza las tablas. |
| `npm run migrate:rollback` | `knex migrate:rollback --all` | Revierte **todas** las migraciones (borra las tablas). |
| `npm run seed` | `knex seed:run` | Carga los datos de prueba. |
| `npm run db:reset` | rollback + migrate + seed | Reinicia la base de datos desde cero. |


## Estructura

```
backend/
├── src/
│   ├── db/             # Migraciones de Knex y datos de prueba (seeds)
│   ├── modules/        # Módulos por dominio (users, stores, products, sales, clients, etc.)
│   ├── shared/         # Configuración, middlewares y utilidades
│   └── app.js          # Servidor Express
├── server.js           # Punto de entrada del backend
└── knexfile.js
```