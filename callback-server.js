// callback-server.js - Servidor simple para manejar callbacks de OAuth
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  if (parsedUrl.pathname === '/callback') {
    console.log('🔗 Callback recibido:', parsedUrl.query);
    
    // Aquí puedes procesar el callback si es necesario
    // Para un bot simple, esto es principalmente informativo
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <body>
          <h1>✅ Callback recibido</h1>
          <p>Tu bot está configurado correctamente.</p>
          <p>Puedes cerrar esta ventana.</p>
        </body>
      </html>
    `);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = 3000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Servidor de callback ejecutándose en http://127.0.0.1:${PORT}/callback`);
  console.log('💡 Puedes cerrar este servidor después de configurar tu app');
});

// Cerrar servidor con Ctrl+C
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando servidor de callback...');
  server.close();
  process.exit(0);
});
