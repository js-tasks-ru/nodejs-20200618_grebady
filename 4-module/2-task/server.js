const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');


const server = new http.Server();

server.on('request', (request, response) => {
  const pathname = url.parse(request.url).pathname.slice(1);
  const limitedStream = new LimitSizeStream({limit: 1048576, emitClose: false}); // 1Mb
  const filepath = path.join(__dirname, 'files', pathname);

  switch (request.method) {
    case 'POST':
      if (pathname.includes('/') || pathname.includes('\\')) {
        response.statusCode = 400;
        response.end('400 not supported');
      } else if (fs.existsSync(filepath)) {
        response.statusCode = 409;
        response.end('409 file have already exist');
      } else if (parseInt((request.headers['content-length']) > 1048576)) {
        response.statusCode = 413;
        response.end('413 too big file');
      } else {
        request.pipe(limitedStream)
            .on('error', function(error) {
              if (error.code === 'LIMIT_EXCEEDED') {
                response.statusCode = 413;
                response.end('413 too big file');
                fs.unlink(filepath, (err) => {
                  if (err) {
                    console.error(err);
                  }
                  file.destroy();
                  console.log(`${filepath} was deleted`);
                });
              } else {
                response.statusCode = 500;
                response.end('500 bad request');
              }
            });
        const file = fs.createWriteStream(filepath, {emitClose: false});
        limitedStream.pipe(file)
            .on('error', function(error) {
              console.log(error);
              response.statusCode = 500;
              response.end('500 bad request');
            })
            .on('close', function() {
              response.statusCode = 201;
              response.end('201 file has written');
            });
      }
      break;

    default:
      response.statusCode = 501;
      response.end('Not implemented');
  }

  response.on('close', function() {
    if (response.finished === false) {
      fs.unlink(filepath, (err) => {
        if (err) {
          console.error(err);
        }
        file.destroy();
        console.log(`${filepath} was deleted`);
      });
    }
  });
});

module.exports = server;
