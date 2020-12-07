class ValidationError extends Error {
  constructor() {
    super('ValidationError');
    this.name = 'ValidationError';
    this.errors.email.message = 'Некорректный email.';
  }
}

module.exports = ValidationError;
