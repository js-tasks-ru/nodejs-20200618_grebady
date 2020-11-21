const {Transform} = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.dataLength = 0;
  }

  _transform(chunk, encoding, callback) {
    this.dataLength += chunk.length;
    if (this.dataLength > this.limit) {
      return callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}


module.exports = LimitSizeStream;
