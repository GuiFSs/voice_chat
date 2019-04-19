import React, { Component } from 'react';
import io from 'socket.io-client';
import MPeer from './components/MPeer/MPeer';
import Login from './components/Login/Login';
import axios from 'axios';

const socketUrl = 'http://localhost:5000/';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(socketUrl),
      isAuthenticate: false,
      user: {}
    };
  }

  // static getDerivedStateFromProps = () => ({ socket: io(socketUrl) });

  componentDidMount() {
    const { socket } = this.state;

    socket.on('error', error => {
      throw new Error(error);
    });
  }

  login = async (loginOrCadastrar, user) => {
    const { socket } = this.state;
    if (loginOrCadastrar === 'login') {
      try {
        const res = await axios.post(`${socketUrl}api/user/login`, user);
        console.log(res.data);

        this.setState({ user: res.data.user, isAuthenticate: true });
        socket.emit('login', res.data.user);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await axios.post(`${socketUrl}api/user/cadastrar`, user);
        console.log(res.data.msg);
        socket.emit('new user', res.data.newUser);
      } catch (err) {
        console.log(err);
      }
    }
  };

  render() {
    const { socket, isAuthenticate } = this.state;
    return (
      <div>
        <h1>hi</h1>
        {isAuthenticate ? (
          <MPeer socket={socket} />
        ) : (
          <Login login={this.login} />
        )}
      </div>
    );
  }
}

export default App;
