import React, { Component, Fragment } from 'react';
import io from 'socket.io-client';
import MPeer from './components/MPeer/MPeer';
import Login from './components/Login/Login';
import axios from 'axios';
import Chat from './components/Chat/Chat';
import withRoot from './Layout/withRoot';

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

  login = async (loginOrCadastrar, user) => {
    const { socket } = this.state;
    if (loginOrCadastrar === 'login') {
      try {
        const res = await axios.post(`${socketUrl}api/user/login`, user);
        console.log(res.data.msg);
        this.setState({ user: res.data.user, isAuthenticate: true });
        socket.emit('login', res.data.user);
      } catch (err) {
        console.log(err.response.data.msg);
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
    const { socket, isAuthenticate, user } = this.state;
    return (
      <div className='div-full'>
        {isAuthenticate ? (
          <Fragment>
            {/* <MPeer socket={socket} /> */}
            <Chat socket={socket} user={user} />
          </Fragment>
        ) : (
          <Login login={this.login} />
        )}
      </div>
    );
  }
}

export default withRoot(App);
