# AppRebrands — tienda + admin (producción)

Landing lookalike de apprebrands.com con CMS y compras por WhatsApp.

## Requisitos

- Node.js 20+ (recomendado)
- Espacio en disco para `data/` (JSON persistente)

## Desarrollo

```bash
cd web
npm install
npm run dev
```

- Frontend: http://localhost:5173 (proxy `/api` → :3000)
- API: http://localhost:3000

## Producción local

```bash
cd web
npm install
npm run build
npm start
```

Abre http://localhost:3000

## Empaquetar ZIP

```bash
cd web
npm run pack
```

Genera `deploy/apprebrands-deploy-YYYYMMDD.zip` con `dist/`, `server/`, `package.json`, `data/.gitkeep`, `.env.example`.

En el servidor:

```bash
unzip apprebrands-deploy-*.zip -d apprebrands
cd apprebrands
npm install --omit=dev
cp .env.example .env   # edita ADMIN_PASSWORD y PORT
npm start
```

## Admin

- URL: `/admin`
- Usuario: `admin`
- Contraseña por defecto: `admin123` (o `ADMIN_PASSWORD` en el primer arranque)
- WhatsApp: Admin → WhatsApp

## Persistencia

- Contenido: `data/content.json`
- Auth (hash bcrypt): `data/auth.json`
- Sesiones admin: memoria del proceso Node (se pierden al reiniciar el servidor; hay que volver a entrar)

## Limitación

Necesita **Node.js** en el hosting (no es sitio 100% estático). Opciones: VPS, Railway, Render, Fly.io, o cPanel con “Node.js App” / Passenger.
