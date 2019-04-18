const Room = require('../models/Room');
const User = require('../models/User');
const Message = require('../models/Message');

module.exports = {
  newUserInTheRoom: async userId => {
    try {
      const room = await Room.findOne({ name: 'main channel' }).exec();
      const alredyExists = room.users.includes(userId);
      if (alredyExists) return;
      const user = await User.findById(userId).exec();
      if (user) {
        await room.users.push(userId);
        await room.save();
        return { msg: 'new user has arrived', user };
      }
      return { error: 'the user id does not exist' };
    } catch (error) {
      return { error };
    }
  },

  getAllUsers: async () => {
    try {
      const room = await Room.findOne({ name: 'main channel' }).exec();
      const users = await User.find({ _id: { $in: room.users } }).exec();
      return { users };
    } catch (error) {
      return { error };
    }
  },

  newMessage: async messageId => {
    try {
      const room = await Room.findOne({ name: 'main channel' }).exec();
      room.messages.push(messageId);
    } catch (error) {
      return { error };
    }
  },

  getMessages: async (limit = 20, skip = 0) => {
    try {
      const room = await Room.findOne({ name: 'main channel' }).exec();
      const messages = await Message.find({ _id: { $in: room.messages } })
        .skip(skip)
        .limit(limit)
        .exec();
      return { messages };
    } catch (error) {
      return { error };
    }
  }
};
