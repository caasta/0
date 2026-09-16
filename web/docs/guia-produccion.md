# Guía de producción — AppRebrands

Guía corta para publicar la tienda (landing + admin + WhatsApp) en un hosting con Node.js.

## Qué incluye

- Frontend React (carpeta `dist/`)
- API Express que guarda el contenido en `data/content.json`
- Login de admin en el servidor (contraseña con hash en `data/auth.json`)
- Compras / consultas por WhatsApp (`wa.me`)

**Importante:** no es un sitio solo HTML estático. Hace falta **Node.js** para que el admin y los cambios persistan para todos los visitantes.

## Requisitos

- Node.js **20+**
- npm
- Un puerto libre (por defecto `3000`)
- Permiso de escritura en la carpeta `data/`

## Variables de entorno

Copia `.env.example` a `.env` (o configúralas en el panel del hosting):

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto HTTP | `3000` |
| `ADMIN_PASSWORD` | Contraseña inicial del admin **solo si aún no existe** `data/auth.json` | `TuClaveSegura` |
| `NODE_ENV` | Debe ser `production` en el servidor | `production` |

Notas:

- Usuario del panel: siempre `admin`.
- Si `data/auth.json` ya existe, cambiar `ADMIN_PASSWORD` en `.env` **no** cambia la clave. Usa el panel (Ajustes) o borra `data/auth.json` y reinicia (se regenera con `ADMIN_PASSWORD`).
- Contraseña por defecto de fábrica: `admin123` — **cámbiala en producción**.

## WhatsApp

1. Entra a `/admin` con tu contraseña.
2. Abre la pestaña **WhatsApp**.
3. Pon el número con código de país, solo dígitos, sin `+` (ej. `17871234567`).
4. Ajusta las plantillas si quieres (`{name}`, `{price}`, `{items}`, `{total}`…).
5. Pulsa **Guardar**.

Los botones “Comprar por WhatsApp” y el carrito usarán ese número para todos los visitantes.

## Cómo construir y arrancar (local en modo producción)

Desde la carpeta `web/`:

```bash
npm install
npm run build
npm start
```

Abre: `http://localhost:3000`  
Admin: `http://localhost:3000/admin` → `admin` / tu contraseña.

## Empaquetar ZIP para subir

```bash
npm run pack
```

Se crea un archivo en `deploy/apprebrands-deploy-YYYYMMDD.zip` con:

- `dist/` (frontend)
- `server/` (API)
- `package.json` + `package-lock.json`
- `data/.gitkeep`
- `.env.example` y `README.md`

### En el servidor

```bash
unzip apprebrands-deploy-YYYYMMDD.zip -d apprebrands
cd apprebrands
npm install --omit=dev
cp .env.example .env
# Edita .env: ADMIN_PASSWORD, PORT
npm start
```

Para dejarlo en segundo plano puedes usar `pm2`, `systemd` o el gestor Node del hosting.

## Opciones de hosting

### 1) VPS / cloud con Node (recomendado)

DigitalOcean, Linode, AWS Lightsail, etc.:

1. Sube el ZIP o clona el repo y entra a `web/`.
2. `npm install && npm run build && npm start` (o usa el ZIP + `npm install --omit=dev && npm start`).
3. Pon un proxy inverso (Nginx/Caddy) con HTTPS hacia el puerto de Node.

### 2) PaaS (Railway, Render, Fly.io)

1. Root del servicio: carpeta `web/` (o el contenido del ZIP).
2. Build: `npm install && npm run build` (si despliegas desde el repo).
3. Start: `npm start`
4. Disco persistente o volumen montado en `data/` (si el filesystem es efímero, los cambios se pierden al redeploy).

### 3) cPanel / “Node.js App” / Passenger

1. Crea una aplicación Node apuntando a la carpeta del proyecto.
2. Startup file: `server/index.js`
3. Ejecuta build una vez (`npm run build`) o sube el ZIP ya construido.
4. Asegura que `data/` sea escribible.
5. Variables: `PORT` (el que asigne cPanel), `ADMIN_PASSWORD`, `NODE_ENV=production`.

**No sirve** hosting “solo estático” (Netlify/GitHub Pages sin backend) si quieres que el admin guarde para todos.

## Desarrollo local (con recarga)

```bash
npm install
npm run dev
```

- Tienda en Vite: `http://localhost:5173`
- API: `http://localhost:3000` (Vite hace proxy de `/api`)

## Respaldo y reset

- Exportar/importar JSON desde Admin → **Ajustes**
- Archivos críticos: `data/content.json`, `data/auth.json`
- Reset de contenido (seed): Admin → Ajustes → **Reset a seed**

## Checklist rápido de go-live

1. Cambiar contraseña de admin.
2. Configurar número de WhatsApp real.
3. Revisar productos y precios.
4. Confirmar que `data/` persiste tras reiniciar el proceso.
5. Activar HTTPS en el dominio.
