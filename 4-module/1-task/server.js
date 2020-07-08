const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (request, response) => {
  const pathname = url.parse(request.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (request.method) {
    case 'GET':
      try {
        if (pathname.includes('/') || pathname.includes('\\')) {
          response.statusCode = 400;
          response.end('400 not supported');
        } else if (fs.existsSync(filepath)) {
          response.statusCode = 200;
          fs.createReadStream(filepath).pipe(response);
        } else {
          response.statusCode = 404;
          response.end('404 not found');
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
