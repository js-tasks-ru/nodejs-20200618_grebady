const User = require('../../models/User');

function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) return done(null, false, `Не указан email`);
  const test = 'Luis' + randomInteger(1, 100);
  const emailUser = {
    displayName: test,
    email: email,
  };
  try {
    const user = await User.findOneAndUpdate({email},
        emailUser,
        {
          new: true,
          upsert: true,
        });
    await user.validate();
  } catch (err) {
    return done(err, null);
  }

  const newUser = {
    email: email,
    displayName: displayName,
  };
  try {
    const user = await User.findOneAndUpdate({email},
        newUser,
        {
          new: true,
          upsert: true,
        });
    await user.validate();
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
};
