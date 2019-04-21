import React, { Component } from 'react';
import UsersOnOff from './UsersOnOff/UsersOnOff';
import { Grid } from '@material-ui/core';
import Messages from './Messages/Messages';
import TextArea from './TextArea/TextArea';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  static getDerivedStateFromProps = props => ({ socket: props.socket });

  render() {
    const { usersOfTheRoom, onlineUsers } = this.state;
    return (
      <Grid
        className='div-full'
        container
        direction='row'
        justify='space-between'
        alignItems='stretch'
        spacing={16}
      >
        <Messages />
        <UsersOnOff usersOfTheRoom={usersOfTheRoom} onlineUsers={onlineUsers} />
        <TextArea />
      </Grid>
    );
  }
}

export default Chat;
