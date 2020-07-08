const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.bufer = '';
  }

  _transform(chunk, encoding, callback) {
    if (this.bufer.length > this.limit) {
      return callback(new LimitExceededError());
    }
    this.bufer += chunk;
    callback();
  }
  _flush(callback) {
    this.push(this.bufer);
    callback();
  }
}


module.exports = LimitSizeStream;
