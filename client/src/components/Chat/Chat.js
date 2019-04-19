import React, { Component } from 'react';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onlineUsers: [],
      usersOfTheRoom: [],
      messages: [],
      socket: null
    };
  }

  componentDidMount() {
    const { socket } = this.state;
    // socket.on()
  }

  static getDerivedStateFromProps = props => ({ socket: props.socket });

  render() {
    return <div />;
  }
}

export default Chat;
