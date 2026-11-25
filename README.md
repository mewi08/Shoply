# Shoply

Shoply es una aplicación web para gestionar una tienda de abarrotes: punto de venta, catálogo de productos, lotes de mercadería, clientes, usuarios y administración de tiendas según el rol de cada persona.

## Estructura del proyecto

```
shoply/
├── backend/     # API REST (Express 5, Knex, MySQL)
└── frontend/    # Interfaz web (React 19, Vite 8)
```

Cada carpeta tiene su propio README con los detalles de instalación y scripts:

- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)

## Requisitos

- Node.js (versión LTS recomendada)
- npm
- XAMPP (MySQL / MariaDB)

## Puesta en marcha

1. **Base de datos:** inicia MySQL desde XAMPP y crea la base de datos `shoply`.

2. **Backend:** desde la carpeta `backend/`, instala dependencias, crea las tablas y arranca el servidor:

   ```bash
   cd backend
   npm install
   npm run migrate
   npm run seed        # opcional: datos de prueba
   npm run dev
   ```

   La API queda en `http://localhost:3000`.

3. **Frontend:** en otra terminal, desde la carpeta `frontend/`:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   La aplicación queda en `http://localhost:5173`. Las peticiones a `/api` se redirigen al backend.

## Roles

| Rol | Qué puede hacer |
|---|---|
| **superadmin** | Aprueba, activa y desactiva tiendas, y revisa el detalle de cada una (dueño, usuarios y total de clientes). |
| **admin** | Administra su tienda: usuarios (rol `user`), productos, marcas, categorías, unidades de medida, lotes y clientes. Opera el punto de venta. |
| **user** | Punto de venta, consulta del catálogo, registro de clientes y sus propias ventas del día. |

## Flujo general

1. Una persona registra su tienda desde la pantalla de registro. Queda como solicitud pendiente.
2. El superadmin aprueba la solicitud, y la tienda queda activa.
3. El admin de la tienda registra productos y lotes, y crea a sus empleados (`user`).
4. Los usuarios venden desde el punto de venta, y el stock se descuenta por lote.

## Aislamiento por tienda

Cada consulta se filtra por el `idtienda` del usuario autenticado, así una tienda nunca puede ver ni modificar datos de otra. Si un recurso pertenece a otra tienda, la API responde 404.

## Novedades
