class ErrNoSuchUser extends Error {
  constructor() {
    super('Нет такого пользователя');
    this.status = 404;
  }
}

module.exports = ErrNoSuchUser;
