const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();
  const {email, displayName, password} = ctx.request.body;
  const userInDb = await User.findOne({email});
  if (userInDb) {
    ctx.status = 400;
    ctx.body = {errors: {email: 'Такой email уже существует'}};
    return;
  }
  const user = await new User({email, displayName, verificationToken: `${token}`});
  await user.setPassword(password);
  await user.save();

  await sendMail({
    template: 'confirmation',
    locals: {token},
    to: `${email}`,
    subject: 'Подтвердите почту',
  });
  ctx.body = {status: 'ok'};
  return next();
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const user = await User.findOne({verificationToken});
  if (!user) {
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
    return;
  }
  await User.updateOne(
      {verificationToken},
      {$unset: {
        verificationToken,
      }}
  );
  ctx.body = {token: verificationToken};
  return next();
};
