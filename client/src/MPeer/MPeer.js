import React from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

const socketUrl = 'http://localhost:5000/';
const socket = io(socketUrl);

let myPeer = null;

let othersPeersId = [];

socket.on('new user', () => {
  myPeer = new Peer();
  myPeer.on('open', id => {
    console.log('sou novo, olha meu id:', id);

    socket.emit('add new peer', id);
  });

  myPeerFunctions();
});

socket.on('get other peer id', data => {
  if (!othersPeersId.includes(data) && data !== myPeer.id) {
    othersPeersId.push(data);
    connectPeerWith(data);
    callToPeer(data);
  }
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
      const div = document.getElementById('audio_peers');
      const audio = document.createElement('audio');
      audio.id = 'other_audio_' + call.peer;
      audio.autoplay = true;
      audio.srcObject = remoteStream;
      div.appendChild(audio);
    });
  });
};

const callToPeer = async id => {
  const div = document.getElementById('audio_peers');
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true
  });
  const call = myPeer.call(id, stream);
  console.log('nova call:', call);

  call.on('stream', function(remoteStream) {
    const audio = document.createElement('audio');
    audio.id = 'other_audio_' + id;
    audio.autoplay = true;
    audio.srcObject = remoteStream;
    div.appendChild(audio);
  });
};

const connectPeerWith = id => {
  const conn = myPeer.connect(id);
  // on open will be launch when you successfully connect to PeerServer
  conn.on('open', () => {
    conn.send('hello new user!');
  });
};

const MPeer = () => <div id='audio_peers' />;

export default MPeer;
