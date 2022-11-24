const http = require('http'); //Permet d'utiliser le serveur http
const app = require('./app');

//Retourne un port valide, nombre ou string
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// utilise un port valide ou le 3000
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// gestion des erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//Construit le serveur avec le protocole http et en utilisant app.js
const server = http.createServer(app);

//Lance le gestionnaire d'erreurs
server.on('error', errorHandler); 

//Affiche les infos de connexion dans la console
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
