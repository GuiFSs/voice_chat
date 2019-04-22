import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import Message from './Message/Message';
import './Messages.css';
class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      allMessages: []
    };
  }
  static getDerivedStateFromProps = (props, state) => {
    if (!state.socket) {
      props.socket.emit('get all messages');
      return { socket: props.socket };
    }
    return {};
  };

  componentDidMount() {
    this.scrollToBottom();

    const { socket } = this.state;
    // socket.emit('get all messages');
    socket.on('get all messages', data => {
      this.setState({ allMessages: data });
    });
    socket.on('new message', data => {
      const newMessages = [...this.state.allMessages];
      newMessages.push(data);
      this.setState({ allMessages: newMessages });
    });
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const { allMessages } = this.state;
    const { avatarColor } = this.props;
    return (
      <Grid id='messages-grid' xs={6} sm={9} item>
        {allMessages.map((message, i) => (
          <Message
            avatarColor={avatarColor}
            previousUsrId={
              allMessages[i - 1] ? allMessages[i - 1].user.username : null
            }
            currentUsrId={allMessages[i].user.username}
            date={message.date}
            username={message.user.username}
            key={message._id}
          >
            {message.body}
          </Message>
        ))}
        <div
          style={{ float: 'left', clear: 'both' }}
          ref={el => {
            this.messagesEnd = el;
          }}
        />
      </Grid>
    );
  }
}
export default Messages;
