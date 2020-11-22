const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('../../2-module/1-task/LimitSizeStream');


const server = new http.Server();
const origin = 'http://localhost:3000/';

server.on('request', (request, response) => {
  const pathname = new URL(request.url, origin).pathname.slice(1);
  const limitedStream = new LimitSizeStream({limit: 1048576}); // 1Mb
  const filepath = path.join(__dirname, 'files', pathname);

  switch (request.method) {
    case 'POST':
      if (pathname.includes('/') || pathname.includes('\\')) {
        response.statusCode = 400;
        response.end('400 not supported');
      } else if (fs.existsSync(filepath) || parseInt(request.headers['content-length']) === 0) {
        response.statusCode = 409;
        response.end('409 file have already exist');
      } else if (parseInt((request.headers['content-length']) > 1048576)) {
        response.statusCode = 413;
        response.end('413 too big file');
      }

      request.pipe(limitedStream)
          .on('error', function(error) {
            if (error.code === 'LIMIT_EXCEEDED') {
              response.statusCode = 413;
              response.end('413 too big file');
              fs.unlink(filepath, (err) => {

              });
            } else {
              response.statusCode = 500;
              response.end('500 bad request');
            }
          });
      const file = fs.createWriteStream(filepath);
      limitedStream.pipe(file)
          .on('error', function(error) {
            response.statusCode = 500;
            response.end('500 bad request');
          })
          .on('close', function() {
            response.statusCode = 201;
            response.end('201 file has written');
          });

      break;

    default:
      response.statusCode = 501;
      response.end('Not implemented');
  }

  response.on('close', function() {
    if (response.finished === false) {
      fs.unlink(filepath, (err) => {
        if (err) {

        }
      });
    }
  });
});

module.exports = server;
