const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding;
  }

  _transform(chunk, encoding, callback) {
    const strFromChunk = chunk.toString(this.encoding);
    const arrStrs = strFromChunk.split(os.EOL);
    for (let i = 0; i < arrStrs.length; i++) {
      this.push(Buffer.from(arrStrs[i]));
    }
    callback();
  }

  _flush(callback) {
  }
}


// const lines = new LineSplitStream({
//   encoding: 'utf-8',
// });
//
// function onData(line) {
//   console.log(line);
// }
//
// lines.on('data', onData);
//
// lines.write(`первая строка${os.EOL}вторая строка${os.EOL}третья строка`);
//
// lines.end();


module.exports = LineSplitStream;
