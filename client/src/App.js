import React, { Component } from 'react';
import io from 'socket.io-client';

const socketUrl = 'http://localhost:5000/';

class App extends Component {
  state = {
    socket: null
  };

  componentDidMount() {
    this.initSocket();
  }

  initSocket = () => {
    const socket = io(socketUrl);
    socket.on('connect', () => {
      console.log('Connected');
    });
    socket.on('news', data => {
      console.log(data);
    });
    this.setState({ socket });
  };

  render() {
    return <div className='App'>hi</div>;
  }
}

export default App;

// THIS IS HOW WE GET AUIDO FROM USER
// let constraintObj = {
//   audio: true,
//   video: false
// };

// navigator.mediaDevices
//   .getUserMedia(constraintObj)
//   .then(mediaStreamObj => {
//     // const audioTracks = mediaStreamObj.getAudioTracks();
//     const audioEl = document.querySelector('audio');
//     // const video = document.querySelector('video');

//     // video.srcObject = mediaStreamObj;
//     // video.onloadedmetadata = e => video.play();

//     audioEl.srcObject = mediaStreamObj;
//     audioEl.onloadedmetadata = e => audioEl.play();
//   })
//   .catch(err => {
//     throw new Error(err);
//   });
