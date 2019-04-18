const Message = require('../models/Message');

module.newMessage = async data => {
  try {
    const newMessage = new Message({ ...data });
    await newMessage.save();
    return { newMessage };
  } catch (error) {
    return { error };
  }
};

module.exports = module;
