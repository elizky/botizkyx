# 🤖 Bot Dashboard - Twitter Bot Management

Dashboard web para gestionar mensajes de Twitter de forma automática y manual. Permite crear, programar y publicar tweets desde una interfaz web moderna.

## ✨ Características Implementadas

### 🔐 Autenticación
- ✅ Login simple con contraseña
- ✅ Middleware de protección de rutas
- ✅ Sesiones con cookies seguras

### 📱 Dashboard Web
- ✅ **Interfaz responsive** con shadcn/ui
- ✅ **Formulario de mensajes** con validación de longitud (280 caracteres)
- ✅ **Lista de mensajes pendientes** con botón "Postear Ahora"
- ✅ **Historial de mensajes** publicados
- ✅ **Notificaciones toast** para feedback del usuario
- ✅ **Diseño moderno** con Tailwind CSS

### 🗄️ Base de Datos
- ✅ **SQLite** con Prisma ORM
- ✅ **Modelo Message** con campos:
  - `id`, `content`, `isPosted`, `postedAt`, `createdAt`
- ✅ **Migrations** automáticas

### 🔧 Twitter API
- ✅ **Integración completa** con Twitter API v2
- ✅ **Posteo manual** desde el dashboard
- ✅ **Manejo de errores** y validaciones
- ✅ **Credenciales OAuth 1.0a** configuradas

### 🚀 Funcionalidades
- ✅ **Agregar mensajes** a la cola
- ✅ **Postear inmediatamente** desde el dashboard
- ✅ **Eliminar mensajes** no deseados
- ✅ **Validación de longitud** en tiempo real
- ✅ **Historial completo** de publicaciones

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Next.js 14, React, TypeScript
- **UI:** shadcn/ui, Tailwind CSS
- **Backend:** Next.js API Routes, Server Actions
- **Base de Datos:** SQLite, Prisma ORM
- **Autenticación:** Cookies, Middleware
- **Notificaciones:** Sonner (Toast)
- **Twitter API:** twitter-api-v2

## 🚀 Instalación y Uso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env.local` basado en `.env.local.example`:
```env
# Dashboard Password
DASHBOARD_PASSWORD=BotIzkyX2024!@#

# Twitter API Credentials - OAuth 1.0a
TWITTER_APP_KEY=tu_api_key_aqui
TWITTER_APP_SECRET=tu_api_secret_aqui
TWITTER_ACCESS_TOKEN=tu_access_token_aqui
TWITTER_ACCESS_SECRET=tu_access_token_secret_aqui

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Configurar base de datos
```bash
npx prisma generate
npx prisma db push
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

### 5. Acceder al dashboard
- **URL:** http://localhost:3000
- **Contraseña:** `BotIzkyX2024!@#`

## ✅ Funcionalidades Completadas

### 🔄 Integración con Bot Actual
- ✅ **Bot dashboard** creado (`src/bot-dashboard.ts`)
- ✅ **Integración con base de datos** implementada
- ✅ **GitHub Actions** actualizado para usar dashboard

### 🤖 Automatización
- ✅ **GitHub Actions** configurado para posteo automático
- ✅ **Bot dashboard** lee mensajes de la base de datos
- ✅ **Manejo de rate limits** implementado

### 🚀 Deploy y Producción
- ✅ **Build exitoso** verificado
- ✅ **Variables de entorno** documentadas
- ✅ **Listo para Vercel** con configuración completa

## 📋 Funcionalidades Futuras

### 🎨 Mejoras de UX
- [ ] **Programación de mensajes** con fechas específicas
- [ ] **Edición de mensajes** existentes
- [ ] **Duplicar mensajes** para reutilizar
- [ ] **Estadísticas** de engagement

### 🔧 Funcionalidades Avanzadas
- [ ] **Generación de mensajes con IA** (OpenAI)
- [ ] **Templates de mensajes** predefinidos
- [ ] **Hashtags automáticos** basados en contenido
- [ ] **Análisis de sentimientos** de mensajes

## 📁 Estructura del Proyecto

```
dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Página de login
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard principal
│   │   ├── api/
│   │   │   ├── auth/route.ts     # API de autenticación
│   │   │   ├── logout/route.ts   # API de logout
│   │   │   └── messages/route.ts # API de mensajes
│   │   └── actions/
│   │       └── message-actions.ts # Server Actions
│   ├── components/
│   │   ├── LoginForm.tsx         # Formulario de login
│   │   ├── MessageForm.tsx       # Formulario de mensajes
│   │   ├── MessageList.tsx       # Lista de mensajes
│   │   ├── HistoryList.tsx       # Historial
│   │   └── ui/                   # Componentes shadcn/ui
│   └── lib/
│       ├── database.ts           # Configuración Prisma
│       ├── auth.ts               # Lógica de autenticación
│       └── twitter-service.ts    # Servicio de Twitter
├── prisma/
│   └── schema.prisma             # Esquema de base de datos
└── package.json
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construcción
npm run start        # Producción
npm run lint         # Linting
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles

---

**Desarrollado con ❤️ para automatizar tu presencia en Twitter**