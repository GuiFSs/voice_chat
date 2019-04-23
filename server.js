const express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  bodyParser = require('body-parser'),
  io = require('socket.io').listen(server),
  port = process.env.PORT || 5000,
  mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader(
    'Access-Control-Allow-Headers',
    'accept, authorization, content-type, x-requested-with'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE'
  );
  res.setHeader('Access-Control-Allow-Origin', req.header('origin'));
  next();
});

const apiRoom = require('./api/room');
const apiUser = require('./api/user');
const apiMessage = require('./api/message');
const userRouter = require('./routes/user');

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

app.use('/api/user', userRouter);

server.listen(port, () => console.log(`Server running on port ${port}`));

let peers = [];
let onlineUsers = [];

io.sockets.on('connection', async socket => {
  // user related
  socket.on('new user', async data => {
    try {
      await apiRoom.newUserInTheRoom(data._id);
    } catch (err) {
      await apiRoom.createRoom('main channel');
      console.log('room created');

      await apiRoom.newUserInTheRoom(data._id);
    }
    const { users } = await apiRoom.getAllUsers();
    socket.broadcast.emit('get users of the room', users);
  });

  socket.on('login', async data => {
    onlineUsers.push({ socketId: socket.id, user: data });
    io.sockets.emit('get online users', onlineUsers);
    const { users } = await apiRoom.getAllUsers();
    socket.emit('get users of the room', users);

    const { messages: allMessages } = await apiRoom.getAllMessages();

    io.sockets.emit('get all messages', allMessages);
    console.log('online users', onlineUsers.length);
  });

  // message related
  socket.on('new message', async data => {
    const { newMessage, error } = await apiMessage.newMessage(data);
    if (error) {
      throw new Error(error);
    }
    const user = await apiUser.getUserById(newMessage.user);
    const message = {
      _id: newMessage._id,
      user: user,
      body: newMessage.body,
      date: newMessage.date
    };
    io.sockets.emit('new message', message);
    await apiRoom.newMessage(newMessage._id);
  });

  socket.on('typing', data => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('stop typing', data => {
    io.sockets.emit('stop typing', data);
  });

  // peer related
  socket.on('add new peer', peerId => {
    peers.push({ id: socket.id, peerId });
    console.log(`number of users in voice chaht: ${peers.length}`);
    socket.broadcast.emit('get other peer id', peerId);
  });

  socket.on('disconnect', () => {
    const peerIndex = findPeerIndex(socket.id);
    const onlineUsersIndex = findUserIndex(socket.id);

    let disconnectedUser = onlineUsers[onlineUsersIndex];
    if (disconnectedUser) {
      removeUserByIndex(onlineUsersIndex);
      socket.broadcast.emit('user disconnected', disconnectedUser);
    }
    removePeerByIndex(peerIndex);
    console.log(
      `user disconnected, number of users: ${onlineUsers.length}, peers: ${
        peers.length
      }`
    );
  });
});

const removeUserByIndex = onlineUsersIndex =>
  onlineUsers.splice(onlineUsersIndex, 1);
const removePeerByIndex = peerIndex => peers.splice(peerIndex, 1);

const findPeerIndex = id => {
  let peerIndex = null;
  peers.filter((user, index) => {
    if (user.id === id) {
      peerIndex = index;
      return true;
    }
    return false;
  });

  return peerIndex;
};

const findUserIndex = id => {
  let onlineUsersIndex = null;
  onlineUsers.filter((user, index) => {
    if (user.socketId === id) {
      onlineUsersIndex = index;
      return true;
    }
    return false;
  });

  return onlineUsersIndex;
};
