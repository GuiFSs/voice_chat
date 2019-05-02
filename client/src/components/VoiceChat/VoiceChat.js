import React, { Component } from 'react';
import { Grid, Button } from '@material-ui/core';
import PeerConnection from './PeerConnection';
import Peer from 'peerjs';

class VoiceChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      users: [],
      showConnectButton: 'visible',
      userConnectedToVoiceChat: false,
      myPeer: null
    };
  }

  static getDerivedStateFromProps = props => ({ socket: props.socket });

  connectToVoiceChat = () => {
    const { socket } = this.state;
    const myPeer = new Peer();
    myPeer.on('open', id => {
      console.log('my peer is:', id);

      socket.emit('add new peer', id);
      this.setState({
        userConnectedToVoiceChat: true,
        showConnectButton: 'hidden',
        myPeer
      });
    });
    return myPeer;
  };

  render() {
    const {
      socket,
      userConnectedToVoiceChat,
      showConnectButton,
      myPeer
    } = this.state;
    return (
      <Grid
        style={{
          backgroundColor: '#2F3136',
          padding: '20px'
        }}
        sm={2}
        item
      >
        {userConnectedToVoiceChat && (
          <PeerConnection myPeer={myPeer} socket={socket} />
        )}

        <Button
          variant='contained'
          style={{ visibility: showConnectButton }}
          onClick={this.connectToVoiceChat}
          color='primary'
        >
          Connect to voice chat
        </Button>
      </Grid>
    );
  }
}
export default VoiceChat;
