const mongoose = require('mongoose');
const crypto = require('crypto');
const connection = require('../libs/connection');
const config = require('../config');
const {ErrWrongPassword, ErrNoSuchUser} = require('../controllers/errors');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'E-mail пользователя не должен быть пустым.',
    validate: [
      {
        validator(value) {
          return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
        },
        message: 'Некорректный email.',
      },
    ],
    unique: 'Такой email уже существует',
  },
  displayName: {
    type: String,
    required: 'У пользователя должно быть имя',
    unique: 'Такое имя уже существует',
  },
  passwordHash: {
    type: String,
  },
  salt: {
    type: String,
  },
}, {
  timestamps: true,
});

function generatePassword(salt, password) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
        password, salt,
        config.crypto.iterations,
        config.crypto.length,
        config.crypto.digest,
        (err, key) => {
          if (err) return reject(err);
          resolve(key.toString('hex'));
        }
    );
  });
}

function generateSalt() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(config.crypto.length, (err, buffer) => {
      if (err) return reject(err);
      resolve(buffer.toString('hex'));
    });
  });
}

userSchema.methods.setPassword = async function setPassword(password) {
  this.salt = await generateSalt();
  this.passwordHash = await generatePassword(this.salt, password);
};

userSchema.statics.login = async function(login, password) {
  // this === User
  const user = await this.findOne({email: `${login}`});
  if (!user) return new ErrNoSuchUser();

  if (! await user.checkPassword(password)) return new ErrWrongPassword();
  return user;
};


userSchema.methods.loginUser = function(password) {
  if (!this.checkPassword(password)) {
    return new ErrWrongPassword();
  } else return this;
};


userSchema.methods.checkPassword = async function(password) {
  if (!password) return false;

  const hash = await generatePassword(this.salt, password);
  return hash === this.passwordHash;
};

module.exports = connection.model('User', userSchema);
