const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
  // Graphql mutation to create new users
  createUser: async arg => {
    try {
      const existingUser = await User.findOne({ email: arg.userInput.email });
      if (existingUser) {
        throw new Error('This user is already registered.');
      }
      const hashedPassword = await bcrypt.hash(arg.userInput.password, 12);

      const user = new User({
        email: arg.userInput.email,
        password: hashedPassword,
      });

      const res = await user.save();
      return { ...res._doc, password: null, _id: res.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      throw new Error('Password is incorrect');
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, 'secretkeyfortesting', {
      expiresIn: '1h',
    });
    return { userId: user.id, token: token, tokenExpiration: 1 };
  },
};
