# 🚀 Guía de Deploy - BotIzkyX

## 📋 Checklist Pre-Deploy

- [x] ✅ Bot compilado exitosamente
- [x] ✅ Dashboard build exitoso
- [x] ✅ GitHub Actions configurado
- [x] ✅ Variables de entorno documentadas
- [x] ✅ READMEs actualizados

## 🌐 Deploy en Vercel

### 1. Conectar Repositorio
1. Ir a [vercel.com](https://vercel.com)
2. Conectar con GitHub
3. Seleccionar el repositorio `botizkyx`
4. Configurar como proyecto Next.js

### 2. Configurar Variables de Entorno
En Vercel Dashboard → Settings → Environment Variables:

```
TWITTER_APP_KEY=tu_api_key
TWITTER_APP_SECRET=tu_api_secret
TWITTER_ACCESS_TOKEN=tu_access_token
TWITTER_ACCESS_SECRET=tu_access_token_secret
DASHBOARD_PASSWORD=tu_contraseña_segura
```

### 3. Configurar Build Settings
- **Framework Preset:** Next.js
- **Root Directory:** `dashboard`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### 4. Deploy
- Vercel detectará automáticamente el proyecto
- Deploy automático desde rama `main`
- URL generada: `https://botizkyx.vercel.app`

## 🤖 GitHub Actions

### Configurar Secrets
En GitHub → Settings → Secrets and variables → Actions:

```
TWITTER_APP_KEY=tu_api_key
TWITTER_APP_SECRET=tu_api_secret
TWITTER_ACCESS_TOKEN=tu_access_token
TWITTER_ACCESS_SECRET=tu_access_token_secret
```

### Workflows Incluidos
- **`tweet-daily.yml`** - Ejecuta diariamente a las 12:00 UTC
- **`cleanup.yml`** - Limpieza manual de cuenta

## 🔄 Flujo de Trabajo Completo

1. **Desarrollo Local:**
   ```bash
   # Dashboard
   cd dashboard && npm run dev
   
   # Bot
   npm run start:dashboard
   ```

2. **Deploy:**
   ```bash
   git add .
   git commit -m "feat: ready for production"
   git push origin main
   ```

3. **Automatización:**
   - Vercel deploya automáticamente
   - GitHub Actions ejecuta diariamente
   - Bot lee mensajes del dashboard

## 🛠️ Mantenimiento

### Monitoreo
- **Vercel:** Logs en dashboard
- **GitHub Actions:** Logs en Actions tab
- **Twitter API:** Rate limits en logs

### Actualizaciones
- Cambios en código → Push a `main`
- Deploy automático en Vercel
- Bot actualizado automáticamente

## 🆘 Solución de Problemas

### Deploy Falla
1. Verificar variables de entorno
2. Revisar logs de build en Vercel
3. Comprobar que `npm run build` funciona localmente

### Bot No Ejecuta
1. Verificar secrets en GitHub
2. Revisar logs de GitHub Actions
3. Comprobar permisos de Twitter API

### Dashboard No Carga
1. Verificar variables de entorno en Vercel
2. Comprobar que la base de datos esté inicializada
3. Revisar logs de la aplicación

## 📊 Monitoreo de Producción

### Métricas Importantes
- **Uptime:** Vercel dashboard
- **Tweets publicados:** Historial en dashboard
- **Rate limits:** Logs de GitHub Actions
- **Errores:** Logs de aplicación

### Alertas Recomendadas
- Fallos en GitHub Actions
- Errores de Twitter API
- Deploy failures en Vercel

---

**¡El proyecto está listo para producción! 🚀**
