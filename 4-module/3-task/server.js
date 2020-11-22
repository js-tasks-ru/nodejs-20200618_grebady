const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();
const origin = 'http://localhost:3001/';

server.on('request', (req, res) => {
  const pathname = new URL(req.url, origin).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.includes('/') || pathname.includes('\\')) {
        res.statusCode = 400;
        res.end('400 not supported');
        return;
      }

      if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end('404 not found');
        return;
      }

      fs.unlinkSync(filepath);
      res.statusCode = 200;
      res.end('file have deleted');

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
