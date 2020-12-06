class ErrWrongPassword extends Error {
  constructor() {
    super('Неверный пароль');
    this.status = 403;
  }
}

module.exports = ErrWrongPassword;
