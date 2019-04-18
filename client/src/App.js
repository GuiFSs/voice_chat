import React, { Component } from 'react';
import io from 'socket.io-client';
import MPeer from './components/MPeer/MPeer';

const socketUrl = 'http://localhost:5000/';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null
    };
  }

  static getDerivedStateFromProps = () => ({ socket: io(socketUrl) });

  render() {
    const { socket } = this.state;
    return (
      <div>
        <h1>hi</h1>
        <MPeer socket={socket} />
      </div>
    );
  }
}

export default App;
