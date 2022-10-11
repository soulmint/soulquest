const tus = require('tus-node-server');

const server = new tus.Server();
server.datastore = new tus.FileStore({
  path: '/public/uploads'
});

const host = '127.0.0.1';
const port = 8585;
server.listen({ host, port }, () => {
  console.log(`[${new Date().toLocaleTimeString()}] tus server listening at http://${host}:${port}`);
});
