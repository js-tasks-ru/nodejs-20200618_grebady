class ErrorConnectReset extends Error {
  constructor(message) {
    super(message);
    this.code = 'ECONNRESET';
  }
}
module.exports = ErrorConnectReset;
