const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (request, response) => {
  const pathname = new URL(request.url, 'http://localhost:3000/').pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (request.method) {
    case 'GET':
      try {
        if (pathname.includes('/') || pathname.includes('\\')) {
          response.statusCode = 400;
          response.end('400 not supported');
        } else if (!fs.existsSync(filepath)) {
          response.statusCode = 404;
          response.end('404 not found');
        } else {
          response.statusCode = 200;
          const stream = fs.createReadStream(filepath);
          stream.pipe(response);
        }
      } catch (err) {
        console.error(err);
      }
      break;

    default:
      response.statusCode = 501;
      response.end('Not implemented');
  }
});

module.exports = server;
