import React from 'react';

let P2P = require('./index');
let io = require('socket.io-client');

window.AudioContext = window.AudioContext || window.webkitAudioContext;

let socket = io();
let p2p = new P2P(socket, { numClients: 10 });
// let startButton = document.getElementById('start-stream');

p2p.on('start-stream', function() {
  p2p.usePeerConnection = true;
  // startButton.setAttribute('disabled', true);
});

p2p.on('stream', function(stream) {
  let audio = document.querySelector('audio');
  audio.srcObject = stream;
  audio.play();
});

function startStream() {  
  // startButton.setAttribute('disabled', true);
  navigator.getUserMedia(
    { audio: true },
    function(stream) {
      let audioContext = new window.AudioContext();
      let mediaStreamSource = audioContext.createMediaStreamSource(stream);
      let mediaStreamDestination = audioContext.createMediaStreamDestination();
      mediaStreamSource.connect(mediaStreamDestination);

      let socket = io();
      let p2p = new P2P(socket, {
        peerOpts: { stream: mediaStreamDestination.stream, numClients: 10 }
      });

      p2p.on('ready', function() {
        p2p.usePeerConnection = true;
      });

      p2p.emit('ready', { peerId: p2p.peerId });
    },
    function(err) {
      console.log(err);
    }
  );
}

const P2PConnection = () => (
  <div className='p2p-connection'>
    <audio />
    <button onClick={startStream}> start stream</button>
  </div>
);

export default P2PConnection;
