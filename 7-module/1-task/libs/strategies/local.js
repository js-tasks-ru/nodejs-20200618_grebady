const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async (email, password, done) => {
      const user = await User.login(email, password);
      if (user instanceof Error) {
        return done(false, false, user.message);
      }
      return done(false, user);
    }
);
