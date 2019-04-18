const User = require('../models/User');

module.createUser = async data => {
  try {
    const user = await User.findOne({ username: data.username }).exec();
    if (user) {
      return { error: 'user already exists' };
    }
    const newUser = new User({ ...data });
    await newUser.save();
    return { newUser, msg: 'user created with success' };
  } catch (error) {
    return { error };
  }
};

module.login = async data => {
  try {
    const user = await User.findOne({ username: data.username }).exec();
    if (!user) return { error: 'user does not exist' };

    const doesMatch = data.password === user.password;
    if (doesMatch) return { user };

    return { error: 'username or password does not match' };
  } catch (error) {
    return { error };
  }
};

module.exports = module;
