# Guía de producción — AppRebrands

Guía corta para publicar la tienda (landing + admin + WhatsApp) en un hosting con Node.js.

## Qué incluye

- Frontend React (carpeta `dist/`)
- API Express que guarda el contenido en `data/content.json`
- Login de admin en el servidor (contraseña con hash en `data/auth.json`)
- Catálogo `/store` + fichas `/store/product/:id` (SPA fallback en Express)
- Compras / consultas por WhatsApp (`wa.me`)

**Importante:** no es un sitio solo HTML estático. Hace falta **Node.js** para que el admin y los cambios persistan para todos los visitantes.

### Rutas públicas

| Ruta | Contenido |
|---|---|
| `/` | Landing |
| `/store` | Catálogo (búsqueda, categoría, tipo, orden) |
| `/store/product/:id` | Ficha de producto (galería, specs, WhatsApp) |
| `/cart` | Lista / pedido WhatsApp |
| `/admin` | CMS (productos enriquecidos: galería, descripción larga, features, etc.) |

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

## Descargar el ZIP (sin GitHub)

El paquete listo para subir está en el **Project Context → media**:

- Ruta estable: `media/apprebrands-deploy.zip`
- Copia con fecha: `media/apprebrands-deploy-YYYYMMDD.zip`

Descárgalo a tu PC, súbelo al hosting (o descomprime localmente) y continúa:

```bash
unzip apprebrands-deploy.zip -d apprebrands
cd apprebrands
npm install --omit=dev
cp .env.example .env
# Edita .env: ADMIN_PASSWORD, PORT
npm start
```

No hace falta clonar ningún repositorio.

El ZIP incluye: `dist/`, `server/`, `package.json` + lock, `data/.gitkeep`, `.env.example`, `README.md`.

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

Campos típicos en cPanel → **Setup Node.js App**:

| Campo | Valor |
|---|---|
| Node.js version | **20** |
| Application root | `/home/iptvzlax/web.paneles.xyz` (la carpeta donde descomprimiste el ZIP) |
| Application URL | `web.paneles.xyz` |
| Application startup file | **`app.js`** (alternativa: `server/index.js`) |
| Application mode | Production |

Variables de entorno en el panel:

- `NODE_ENV=production`
- `HOST=0.0.0.0`
- `ADMIN_PASSWORD=TuClaveSegura` (solo aplica si aún no existe `data/auth.json`)
- `PORT` lo asigna cPanel (no lo fuerces salvo que el panel lo pida)

Después de subir el ZIP, en la terminal del hosting:

```bash
source /home/iptvzlax/nodevenv/web.paneles.xyz/20/bin/activate && cd /home/iptvzlax/web.paneles.xyz
npm install --omit=dev
```

Luego **Restart** de la app en cPanel. Prueba:

- https://web.paneles.xyz/
- https://web.paneles.xyz/api/health  → debe devolver JSON `{"ok":true,...}`
- https://web.paneles.xyz/admin

Asegura que la carpeta `data/` sea escribible (`chmod 755 data` o el dueño correcto).

**No sirve** hosting “solo estático” (Netlify/GitHub Pages sin backend) si quieres que el admin guarde para todos.

### Error cPanel: content-type `text/html` vs `text/html; charset=utf-8`

Mensaje típico tras “Run NPM Install”:

> An error occured during installation of modules... Web application responds, but its return code "None" or content type before operation "text/html" doesn't equal to content type after operation "text/html; charset=utf-8".

Esto es un **falso positivo conocido** del comprobador de cPanel: compara cabeceras HTML antes/después del install y a veces falla aunque la app esté bien.

Qué hacer:

1. En terminal (con el venv de Node 20):

```bash
source /home/iptvzlax/nodevenv/web.paneles.xyz/20/bin/activate && cd /home/iptvzlax/web.paneles.xyz
npm install --omit=dev
```

2. En cPanel → Node.js App: **Restart**.
3. Abre https://web.paneles.xyz/ y https://web.paneles.xyz/api/health
4. Si la tienda carga y `/api/health` responde JSON, **puedes ignorar** ese aviso del instalador.
5. Startup file preferido: `app.js` (también vale `server/index.js`).
6. Si la página no abre: revisa logs de la app Node, que exista `dist/`, y que `data/` sea escribible.

El paquete actual fuerza `Content-Type: text/html; charset=utf-8` en el SPA y JSON con charset para reducir este falso positivo.

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

### IDs de producto (`p1` → `4`, etc.)

El catálogo en vivo usa IDs numéricos (`/store/product/4`). El seed actual ya trae `4`, `3`, `1`, `2`.

Al arrancar, el servidor **migra automáticamente** IDs antiguos `p1`–`p4` a esos números y rellena campos de ficha (galería, features…) si faltan. `/store/product/p1` redirige a `/store/product/4`.

Si tras subir el ZIP sigues viendo URLs `…/product/p1` o fichas incompletas:

1. Entra a `/admin` → **Ajustes** → **Reset a seed**, **o**
2. Borra `data/content.json` en el servidor y **Restart** la app Node (se regenera desde el seed).

Conserva `data/auth.json` si no quieres resetear la contraseña de admin.

## Checklist rápido de go-live

1. Cambiar contraseña de admin.
2. Configurar número de WhatsApp real.
3. Revisar productos y precios (URLs `/store/product/4`, etc.).
4. Confirmar que `data/` persiste tras reiniciar el proceso.
5. Activar HTTPS en el dominio.
