# 🤖 GitHub Actions - Bot de X

Este directorio contiene los workflows de GitHub Actions para automatizar tu bot de X.

## 📋 Workflows Disponibles

### 1. **Tweet Diario** (`tweet-daily.yml`)
- **Frecuencia**: Todos los días a las 12:00 UTC (9:00 AM Argentina)
- **Función**: Publica un tweet automáticamente
- **Ejecución manual**: ✅ Disponible desde GitHub UI

### 2. **Limpieza de Cuenta** (`cleanup.yml`)
- **Frecuencia**: Solo manual (por seguridad)
- **Función**: Limpia tweets y seguidos de tu cuenta
- **Opciones**:
  - `stats`: Ver estadísticas de la cuenta
  - `cleanup-tweets`: Eliminar solo tweets
  - `cleanup-follows`: Dejar de seguir solo usuarios
  - `full-cleanup`: Limpieza completa

## 🔧 Configuración Requerida

### Secrets de GitHub
Configura estos secrets en tu repositorio (Settings → Secrets and variables → Actions):

```
TWITTER_APP_KEY=tu_api_key
TWITTER_APP_SECRET=tu_api_secret
TWITTER_ACCESS_TOKEN=tu_access_token
TWITTER_ACCESS_SECRET=tu_access_token_secret
```

### Cómo configurar secrets:
1. Ve a tu repositorio en GitHub
2. Click en **Settings**
3. Click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**
5. Agrega cada variable con su valor

## 🚀 Cómo usar

### Ejecutar Tweet Diario:
- **Automático**: Se ejecuta solo todos los días
- **Manual**: Ve a Actions → Tweet Diario → Run workflow

### Ejecutar Limpieza:
1. Ve a **Actions** en tu repositorio
2. Selecciona **Limpieza de Cuenta**
3. Click en **Run workflow**
4. Elige la acción que quieres realizar
5. Click en **Run workflow**

## ⚠️ Consideraciones Importantes

### Tweet Diario:
- ✅ **Seguro**: Solo publica tweets
- ✅ **Automático**: No requiere intervención
- ⚠️ **Rate Limits**: Respeta los límites de Twitter

### Limpieza de Cuenta:
- ⚠️ **PELIGROSO**: Puede eliminar contenido permanentemente
- ⚠️ **Solo manual**: Requiere confirmación explícita
- ⚠️ **Irreversible**: Los tweets eliminados no se pueden recuperar

## 📊 Logs y Monitoreo

- Los logs se guardan como artifacts en cada ejecución
- Puedes descargar los logs desde la pestaña **Artifacts**
- Los logs se mantienen por 7-30 días dependiendo del workflow

## 🛠️ Personalización

### Cambiar horario del tweet diario:
Edita el archivo `tweet-daily.yml` y modifica la línea:
```yaml
- cron: '0 12 * * *'  # Cambia los números según necesites
```

### Formato de cron:
```
┌───────────── minuto (0 - 59)
│ ┌───────────── hora (0 - 23)
│ │ ┌───────────── día del mes (1 - 31)
│ │ │ ┌───────────── mes (1 - 12)
│ │ │ │ ┌───────────── día de la semana (0 - 6)
│ │ │ │ │
* * * * *
```

### Ejemplos de horarios:
- `'0 9 * * *'` - Todos los días a las 9:00 UTC
- `'0 18 * * 1-5'` - Lunes a viernes a las 18:00 UTC
- `'30 14 * * 0'` - Domingos a las 14:30 UTC
