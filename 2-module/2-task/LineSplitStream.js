const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding;
    this.bufer = '';
  }

  _transform(chunk, encoding, callback) {
    let strFromChunk = chunk.toString(this.encoding);

    while (strFromChunk.includes(os.EOL)) {
      const indexOs = strFromChunk.indexOf(os.EOL);
      this.push(this.bufer + Buffer.from(strFromChunk.slice(0, indexOs)));
      this.bufer = '';
      strFromChunk = strFromChunk.slice(indexOs + os.EOL.length, strFromChunk.length);
    }

    this.bufer += Buffer.from(strFromChunk);
    callback();
  }

  _flush(callback) {
    this.push(this.bufer);
    callback();
  }
}


module.exports = LineSplitStream;


