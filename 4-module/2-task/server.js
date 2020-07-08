const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const {pipeline} = require('stream');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (request, response) => {
  const pathname = url.parse(request.url).pathname.slice(1);
  const limitedStream = new LimitSizeStream({limit: 1048576}); // 1Mb
  const filepath = path.join(__dirname, 'files', pathname);


  switch (request.method) {
    case 'POST':
      if (pathname.includes('/') || pathname.includes('\\')) {
        response.statusCode = 400;
        response.end('400 not supported');
      } else if (fs.existsSync(filepath)) {
        response.statusCode = 409;
        response.end('404 file have already exist');
      } else {
        pipeline(
            request,
            limitedStream,
            fs.createWriteStream(filepath),
            (err) => {
              if (err) {
                if (err.code === 'LIMIT_EXCEEDED') {
                  request.abort;
                  response.statusCode = 413;
                  response.end('413 too big file');
                }
              } else {
                response.statusCode = 200;
                console.log('Pipeline succeeded.');
                response.end('200 ok');
              }
            });
      }
      break;

    default:
      response.statusCode = 501;
      response.end('Not implemented');
  }

  // response.on('close', function() {
  //   fs.unlink(filepath, (err) => {
  //     if (err) {
  //       response.statusCode = 500;
  //       console.error(err);
  //     }
  //     console.log('path/file.txt was deleted');
  //   });
  // });
});

module.exports = server;
