# BotIzkyX 🤖

Bot automatizado para publicar tweets en X (Twitter) usando la API oficial.

## 🚀 Características

- ✅ Publicación automática de tweets
- ✅ Sistema de logging avanzado
- ✅ Configuración centralizada
- ✅ Manejo de errores robusto
- ✅ Arquitectura modular y escalable

## 📁 Estructura del Proyecto

```
botizkyx/
├── src/
│   ├── services/          # Servicios (Twitter API)
│   ├── utils/             # Utilidades (Logger, etc.)
│   ├── config/            # Configuración
│   └── bot.js             # Lógica principal del bot
├── logs/                  # Archivos de log
├── main.js                # Punto de entrada
├── package.json
└── README.md
```

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd botizkyx
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales
   ```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` con las siguientes variables:

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

### Obtener Credenciales de Twitter

1. Ve a [developer.x.com](https://developer.x.com)
2. Crea una nueva aplicación
3. Configura los permisos a "Read and write"
4. Obtén los 4 tokens necesarios

## 🚀 Uso

### Ejecutar el bot
```bash
npm start
```

### Ejecutar servidor de callback (opcional)
```bash
npm run callback
```

## 📝 Scripts Disponibles

- `npm start` - Ejecutar el bot
- `npm run callback` - Ejecutar servidor de callback
- `npm test` - Ejecutar tests (próximamente)

## 🔧 Desarrollo

### Estructura de Archivos

- **`src/bot.js`** - Clase principal del bot
- **`src/services/twitterService.js`** - Servicio para interactuar con Twitter API
- **`src/utils/logger.js`** - Sistema de logging
- **`src/config/config.js`** - Configuración centralizada

### Agregar Nuevas Funcionalidades

1. **Nuevos servicios**: Agregar en `src/services/`
2. **Utilidades**: Agregar en `src/utils/`
3. **Configuración**: Modificar `src/config/config.js`

## 📊 Logging

El bot genera logs detallados en:
- **Consola**: Para desarrollo
- **Archivos**: En la carpeta `logs/` (formato JSON)

## 🛡️ Seguridad

- ⚠️ **Nunca** compartas tus tokens de API
- ⚠️ **Nunca** subas el archivo `.env` al repositorio
- ✅ Usa un gestor de contraseñas para almacenar tokens

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

ISC License

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en `logs/`
2. Verifica tu configuración en `.env`
3. Asegúrate de que los permisos de tu app sean "Read and write"

---

Desarrollado con ❤️ por Izky
