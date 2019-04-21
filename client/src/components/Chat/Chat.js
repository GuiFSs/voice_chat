import React, { Component } from 'react';
import UsersOnOff from './UsersOnOff/UsersOnOff';
import { Grid } from '@material-ui/core';
import Messages from './Messages/Messages';
import TextArea from './TextArea/TextArea';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      onlineUsers: [],
      peers: [],
      usersOfTheRoom: [],
      messages: [],
      socket: null
    };
  }

  componentDidMount() {
    const { socket } = this.state;
    socket.on('get online users', data => {
      this.setState({ onlineUsers: data });
    });
    socket.on('get users of the room', data => {
      this.setState({ usersOfTheRoom: data });
    });
  }

  static getDerivedStateFromProps = props => ({
    socket: props.socket,
    user: props.user
  });

  sendMessage = value => {
    if (value.legth === 0) return;
    const { user, socket } = this.state;
    const message = { user: user._id, body: value };
    socket.emit('new message', message);
  };

  render() {
    const { usersOfTheRoom, onlineUsers, socket } = this.state;
    return (
      <Grid
        className='div-full'
        container
        direction='row'
        justify='space-between'
        alignItems='stretch'
        spacing={16}
      >
        <Messages socket={socket} />
        <UsersOnOff usersOfTheRoom={usersOfTheRoom} onlineUsers={onlineUsers} />
        <TextArea sendMessage={this.sendMessage} />
      </Grid>
    );
  }
}

export default Chat;
