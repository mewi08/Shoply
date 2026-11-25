# Frontend Shoply

Este proyecto es el frontend de Shoply, la interfaz web para gestionar una tienda: punto de venta, catálogo de productos, lotes, clientes, usuarios y administración de tiendas según el rol de cada persona.

## Requisitos

- Node.js (versión LTS recomendada)
- npm
- El backend de Shoply en ejecución (ver su README)

## Tecnologías

- **React 19** con **Vite 8**: interfaz y compilación.
- **React Router 7** (`react-router-dom`): navegación y rutas protegidas.
- **lucide-react**: iconos.
- **jsPDF**: generación de tickets en PDF.
- **@fontsource-variable** (Bricolage Grotesque y Figtree): tipografías.
- **ESLint**: revisión del código (`eslint-plugin-react-hooks` y `eslint-plugin-react-refresh`).

## Instalación

1. Entra a la carpeta del frontend e instala las dependencias:

   ```bash
   cd frontend
   npm install
   ```

2. Configura la conexión con la API. Las peticiones van a `/api`, así que si el backend corre en otro puerto, agrega un proxy en `vite.config.js`:

   ```js
   export default defineConfig({
     plugins: [react()],
     server: {
       proxy: {
         "/api": "http://localhost:3000",
       },
     },
   });
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   La aplicación queda disponible en `http://localhost:5173`.

## Scripts

| Script | Comando | Descripción |
|---|---|---|
| `npm run dev` | `vite` | Inicia el servidor de desarrollo. |
| `npm run build` | `vite build` | Genera la versión para producción en `dist/`. |
| `npm run preview` | `vite preview` | Sirve localmente la versión generada. |
| `npm run lint` | `eslint .` | Revisa el código con ESLint. |

## Estructura

```
frontend/
├── src/
│   ├── api/                # Cliente HTTP (request.js)
│   ├── components/
│   │   ├── crud/           # Componentes reutilizables de tablas, formularios y modales
│   │   ├── layout/         # Sidebar y barra superior
│   │   ├── ui/             # Alertas y elementos básicos
│   │   └── protected-route.jsx
│   ├── modules/            # Páginas por dominio (auth, stores, products, sales, clients, catalogs, panel)
│   ├── style/              # Hojas de estilo globales y por módulo
│   ├── App.jsx             # Rutas de la aplicación
│   └── main.jsx
└── vite.config.js
```