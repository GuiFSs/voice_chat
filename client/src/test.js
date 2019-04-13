import React, { Component } from 'react';
// import io from 'socket.io-client';
import Peer from 'simple-peer';

// const socketUrl = 'http://localhost:5000/';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      peer: null,
      yourId: {},
      otherId: {}
    };
    this.otherUserAudio = React.createRef();
  }

  async componentDidMount() {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
    } catch (err) {
      console.log(err);
    }

    this.setState({
      peer: new Peer({
        initiator: window.location.hash === '#init', // true or false whenever is the first peer
        trickle: false,
        stream
      })
    });
    this.connectPeer();
  }

  connectPeer = () => {
    const { peer } = this.state;
    peer.on('signal', data => {
      this.setState({ yourId: data });
    });

    peer.on('stream', stream => {
      this.otherUserAudio.current.srcObject = stream;
      this.otherUserAudio.current.play();
    });
  };

  handleConnect = () => {
    const { peer, otherId } = this.state;
    this.connectPeer();

    peer.signal(otherId);
  };

  handleChangeTextArea = e => {
    this.setState({ [e.target.name]: JSON.parse(e.target.value) });
  };

  render() {
    const { yourId, otherId } = this.state;
    return (
      <div className='App'>
        <h1>hi</h1>
        your ID:
        <textarea
          name='yourId'
          onChange={this.handleChangeTextArea}
          id='yourId'
          value={JSON.stringify(yourId)}
        />
        other ID:
        <textarea
          name='otherId'
          onChange={this.handleChangeTextArea}
          id='otherId'
          value={JSON.stringify(otherId)}
        />
        <button onClick={this.handleConnect}>Connect</button>
        <audio ref={this.otherUserAudio} />
      </div>
    );
  }
}

export default App;
