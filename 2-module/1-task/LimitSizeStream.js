const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.dataLength = 0;
  }

  _transform(chunk, encoding, callback) {
    this.dataLength += chunk.length;
    if (this.dataLength > this.limit) {
      return callback(new LimitExceededError());
    }
    this.push(chunk);
    callback();
  }
}


module.exports = LimitSizeStream;
