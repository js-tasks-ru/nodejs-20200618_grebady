const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');


class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.length = 0;
    this.limit = options.limit;
    // this.bufer = '';
  }

  _transform(chunk, encoding, callback) {
    this.length+=chunk.length;
    if (this.length > this.limit) {
      return callback(new LimitExceededError());
    }
    this.push(chunk);
    callback();
  }
  _flush(callback) {
    callback();
  }
}


module.exports = LimitSizeStream;
