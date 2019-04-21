import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import Message from './Message/Message';
class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      allMessages: []
    };
  }
  static getDerivedStateFromProps = props => ({ socket: props.socket });

  componentDidMount() {
    const { socket } = this.state;
    socket.emit('get all messages');
    socket.on('get all messages', data => {
      console.log(data);

      this.setState({ allMessages: data });
    });
    socket.on('new message', data => {
      const newMessages = [...this.state.allMessages];
      newMessages.push(data);
      this.setState({ allMessages: newMessages });
    });
  }

  render() {
    const { allMessages } = this.state;
    return (
      <Grid xs={6} sm={9} style={{ border: '2px solid red' }} item>
        {allMessages.map(message => (
          <Message>
            {message.user.username}: {message.body}
          </Message>
        ))}
      </Grid>
    );
  }
}
export default Messages;
