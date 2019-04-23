import React, { Component, Fragment } from 'react';
import io from 'socket.io-client';
import Login from './components/Login/Login';
import axios from 'axios';
import Chat from './components/Chat/Chat';
import withRoot from './Layout/withRoot';
import * as muiColors from '@material-ui/core/colors/';

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

  getRandomMUIColor = () => {
    const keys = Object.keys(muiColors);
    const rnd = Math.floor(Math.random() * (keys.length - 1));
    return muiColors[keys[rnd]][500];
  };

  login = async (loginOrCadastrar, user) => {
    const { socket } = this.state;
    if (loginOrCadastrar === 'login') {
      try {
        const res = await axios.post(`${socketUrl}api/user/login`, user);
        console.log(res.data.msg);
        this.setState({
          user: { ...res.data.user },
          isAuthenticate: true
        });
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

  onUserOnClick = () => {
    // const newUser = { ...this.state.user };
    // newUser.avatarColor = this.getRandomMUIColor();
    // this.setState({ user: newUser });
  };

  render() {
    const { socket, isAuthenticate, user } = this.state;

    return (
      <div className='div-full'>
        {isAuthenticate ? (
          <Fragment>
            <Chat
              onUserOnClick={this.onUserOnClick}
              socket={socket}
              user={user}
            />
          </Fragment>
        ) : (
          <Login login={this.login} />
        )}
      </div>
    );
  }
}

export default withRoot(App);
