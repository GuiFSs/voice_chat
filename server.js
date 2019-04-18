const express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  port = process.env.PORT || 5000,
  mongoose = require('mongoose');

const room = require('./api/room');
const user = require('./api/user');
const message = require('./api/message');

const db = require('./config/keys').mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

server.listen(port, () => console.log(`Server running on port ${port}`));

let peers = [];

io.sockets.on('connection', socket => {
  socket.on('new user', async data => {
    const { newUser, msg } = await user.createUser(data);
    await room.newUserInTheRoom(newUser._id);
    socket.emit('new user');
  });

  socket.on('add new peer', peerId => {
    peers.push({ id: socket.id, peerId });
    console.log(`number of users: ${peers.length}`);
    socket.broadcast.emit('get other peer id', peerId);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('disconnected', socket.id);
    removeUserByIndex(findUserIndex(socket.id));
    console.log(`user disconnected, number of users: ${peers.length}`);
  });
});

const removeUserByIndex = index => {
  peers.splice(index, 1);
};

const findUserIndex = id => {
  let userIndex = null;
  peers.filter((user, index) => {
    if (user.id === id) {
      userIndex = index;
      return true;
    }
    return false;
  });
  return userIndex;
};
