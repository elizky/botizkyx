# BotIzkyX 🤖

Bot automatizado para publicar tweets en X (Twitter) con dashboard de gestión de mensajes.

## 🚀 Características

- ✅ **Dashboard Web** - Interfaz para gestionar mensajes
- ✅ **Publicación automática** - Tweets programados diariamente
- ✅ **Cola de mensajes** - Sistema de gestión de contenido
- ✅ **Rate limit handling** - Manejo inteligente de límites de API
- ✅ **Base de datos** - Persistencia con Prisma + SQLite
- ✅ **GitHub Actions** - Automatización completa
- ✅ **TypeScript** - Código tipado y mantenible

## 📁 Estructura del Proyecto

```
botizkyx/
├── src/                   # Bot principal (TypeScript)
│   ├── services/          # Servicios (Twitter API)
│   ├── utils/             # Utilidades (Logger, etc.)
│   ├── config/            # Configuración
│   ├── types/             # Definiciones de tipos
│   ├── bot.ts             # Bot original
│   ├── bot-dashboard.ts   # Bot integrado con dashboard
│   └── main-dashboard.ts  # Punto de entrada del bot dashboard
├── dashboard/             # Dashboard Next.js
│   ├── src/
│   │   ├── app/           # App Router (Next.js 13+)
│   │   ├── components/    # Componentes React
│   │   └── lib/           # Utilidades del dashboard
│   ├── prisma/            # Esquema de base de datos
│   └── package.json
├── .github/workflows/     # GitHub Actions
├── logs/                  # Archivos de log
├── dist/                  # Código compilado
└── README.md
```

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd botizkyx
   ```

2. **Instalar dependencias del bot**
   ```bash
   npm install
   ```

3. **Instalar dependencias del dashboard**
   ```bash
   cd dashboard
   npm install
   cd ..
   ```

4. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales de Twitter
   ```

5. **Configurar variables del dashboard**
   ```bash
   cd dashboard
   cp .env.local.example .env.local
   # Editar .env.local con credenciales y contraseña
   cd ..
   ```

6. **Configurar base de datos**
   ```bash
   cd dashboard
   npx prisma generate
   npx prisma db push
   cd ..
   ```

## ⚙️ Configuración

### Variables de Entorno

#### Bot Principal (`.env`)
```env
# Twitter API Credentials - OAuth 1.0a
TWITTER_APP_KEY=tu_api_key
TWITTER_APP_SECRET=tu_api_secret
TWITTER_ACCESS_TOKEN=tu_access_token
TWITTER_ACCESS_SECRET=tu_access_token_secret

# Configuración opcional
LOG_LEVEL=info
LOG_TO_FILE=true
NODE_ENV=development
```

#### Dashboard (`.env.local`)
```env
# Twitter API Credentials (mismas que el bot)
TWITTER_APP_KEY=tu_api_key
TWITTER_APP_SECRET=tu_api_secret
TWITTER_ACCESS_TOKEN=tu_access_token
TWITTER_ACCESS_SECRET=tu_access_token_secret

# Contraseña del dashboard
DASHBOARD_PASSWORD=tu_contraseña_segura
```

### Obtener Credenciales de Twitter

1. Ve a [developer.x.com](https://developer.x.com)
2. Crea una nueva aplicación
3. Configura los permisos a "Read and write"
4. Obtén los 4 tokens necesarios

## 🚀 Uso

### Dashboard Web
```bash
cd dashboard
npm run dev
# Abrir http://localhost:3000
```

### Bot Principal
```bash
# Bot original (mensaje fijo)
npm start

# Bot dashboard (lee de base de datos)
npm run start:dashboard
```

### Compilar para producción
```bash
# Compilar bot
npm run build

# Compilar dashboard
cd dashboard
npm run build
cd ..
```

## 📝 Scripts Disponibles

### Bot Principal
- `npm start` - Ejecutar bot original
- `npm run start:dashboard` - Ejecutar bot dashboard
- `npm run build` - Compilar TypeScript
- `npm run start:prod` - Ejecutar bot compilado
- `npm run start:dashboard:prod` - Ejecutar bot dashboard compilado

### Dashboard
- `npm run dev` - Desarrollo
- `npm run build` - Compilar para producción
- `npm run start` - Ejecutar en producción

## 🤖 GitHub Actions

El proyecto incluye automatización completa con GitHub Actions:

### Tweet Diario (`tweet-daily.yml`)
- **Frecuencia**: Diario a las 12:00 UTC (9:00 AM Argentina)
- **Función**: Ejecuta el bot dashboard automáticamente
- **Trigger**: Manual desde GitHub UI también disponible

### Limpieza de Cuenta (`cleanup.yml`)
- **Frecuencia**: Manual (workflow_dispatch)
- **Función**: Limpia tweets, unfollows, etc.
- **Uso**: Solo cuando necesites limpiar la cuenta

## 🔧 Desarrollo

### Estructura de Archivos

#### Bot Principal
- **`src/bot.ts`** - Bot original con mensaje fijo
- **`src/bot-dashboard.ts`** - Bot integrado con dashboard
- **`src/services/twitterService.ts`** - Servicio Twitter API
- **`src/utils/logger.ts`** - Sistema de logging
- **`src/config/config.ts`** - Configuración centralizada

#### Dashboard
- **`dashboard/src/app/`** - App Router (Next.js 13+)
- **`dashboard/src/components/`** - Componentes React
- **`dashboard/src/lib/`** - Utilidades del dashboard
- **`dashboard/prisma/schema.prisma`** - Esquema de base de datos

### Agregar Nuevas Funcionalidades

1. **Bot**: Modificar `src/bot-dashboard.ts`
2. **Dashboard**: Agregar componentes en `dashboard/src/components/`
3. **API**: Agregar rutas en `dashboard/src/app/api/`
4. **Base de datos**: Modificar `dashboard/prisma/schema.prisma`

## 📊 Logging

El bot genera logs detallados en:
- **Consola**: Para desarrollo
- **Archivos**: En la carpeta `logs/` (formato JSON)

## 🚀 Deploy

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático desde `main`

### Variables de entorno para Vercel:
- `TWITTER_APP_KEY`
- `TWITTER_APP_SECRET`
- `TWITTER_ACCESS_TOKEN`
- `TWITTER_ACCESS_SECRET`
- `DASHBOARD_PASSWORD`

## 🛡️ Seguridad

- ⚠️ **Nunca** compartas tus tokens de API
- ⚠️ **Nunca** subas archivos `.env` al repositorio
- ✅ Usa un gestor de contraseñas para almacenar tokens
- ✅ Configura contraseña segura para el dashboard

## 🔄 Flujo de Trabajo

1. **Agregar mensajes** en el dashboard
2. **GitHub Actions** ejecuta diariamente
3. **Bot dashboard** lee mensajes de la base de datos
4. **Twitter API** publica el primer mensaje pendiente
5. **Base de datos** marca como posteado y mueve a historial

## 🆘 Solución de Problemas

### Rate Limits
- El bot maneja automáticamente los límites de Twitter API
- Los mensajes permanecen en cola si hay rate limit
- Se reintenta en la próxima ejecución

### Errores de Autenticación
- Verifica que los tokens sean correctos
- Asegúrate de que los permisos sean "Read and write"
- Regenera tokens si es necesario

### Dashboard no carga
- Verifica que las variables de entorno estén configuradas
- Revisa que la base de datos esté inicializada
- Comprueba los logs del servidor

## 📄 Licencia

ISC License

---

Desarrollado con ❤️ por Izky
