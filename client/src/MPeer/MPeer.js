import React from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

// const socketUrl = 'http://localhost:5000/';
const socket = io();

let myPeer = null;

let otherPeerId = '';

socket.on('new user', () => {
  myPeer = new Peer();
  myPeer.on('open', id => {
    socket.emit('add new peer', id);
  });

  myPeerFunctions();
});

socket.on('get other peer id', async data => {
  otherPeerId = data;
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true
  });
  var call = myPeer.call(otherPeerId, stream);
  call.on('stream', function(remoteStream) {
    document.getElementById('friend_audio').srcObject = remoteStream;
  });
  connectPeers();
});

const myPeerFunctions = () => {
  myPeer.on('connection', conn => {
    conn.on('data', data => {
      console.log('yeah, print from othres:', data);
    });
  });

  myPeer.on('call', async call => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
    call.answer(stream);
    call.on('stream', remoteStream => {
      document.getElementById('friend_audio').srcObject = remoteStream;
    });
  });
};

const connectPeers = () => {
  const conn = myPeer.connect(otherPeerId);
  // on open will be launch when you successfully connect to PeerServer
  conn.on('open', () => {
    conn.send('hello there!');
  });
};

const MPeer = () => (
  <div>
    <audio autoPlay id='friend_audio' />
  </div>
);

export default MPeer;
