import React, { Component } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import PeerConnection from './PeerConnection';
import Peer from 'peerjs';
import UserInformation from '../UserInformation/UserInformation';

class VoiceChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      users: [],
      showConnectButton: 'visible',
      userConnectedToVoiceChat: false,
      myPeer: null,
      user: null
    };
  }

  componentDidMount() {
    const { socket } = this.state;
    socket.on('get all peers users', data => {
      this.setState({ users: data });
    });
  }

  static getDerivedStateFromProps = props => ({
    socket: props.socket,
    user: props.user
  });

  connectToVoiceChat = async () => {
    const { socket, showConnectButton, userConnectedToVoiceChat } = this.state;
    if (showConnectButton === 'hidden' || userConnectedToVoiceChat) return;
    await this.setState({
      showConnectButton: 'hidden'
    });
    const myPeer = new Peer({
      host: 'audio-chat-aps.herokuapp.com',
      path: '/peerjs',
      secure: true,
      debug: 3,
      config: {
        iceServers: [
          { url: 'stun3.l.google.com:19302' },
          {
            url: 'turn:192.158.29.39:3478?transport=udp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
          },
          {
            url: 'turn:turn.bistri.com:80',
            credential: 'homeo',
            username: 'homeo'
         }
          // {
          //   url: 'turn:numb.viagenie.ca',
          //   credential: 'guifss',
          //   username: 'webrtc@live.com'
          // }
        ]
      }
    });

    myPeer.on('open', id => {
      socket.emit('add new peer', id);
      console.log('my peer id:', id);
      this.setState({
        userConnectedToVoiceChat: true,
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
      myPeer,
      user,
      users
    } = this.state;
    return (
      <Grid
        style={{
          backgroundColor: '#2F3136',
          padding: '20px'
        }}
        xs={3}
        sm={2}
        item
      >
        {userConnectedToVoiceChat && (
          <PeerConnection myPeer={myPeer} socket={socket} />
        )}

        <div style={{ marginTop: '60px' }}>
          <Typography id='voice-channel' onClick={this.connectToVoiceChat}>
            <svg
              style={{
                width: '20px',
                height: '20px',
                display: 'inline',
                marginRight: '3px',
                float: 'left'
              }}
              viewBox='0 0 24 24'
            >
              <path
                fill='#72767D'
                d='M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z'
              />
            </svg>
            Knéél de voix
          </Typography>
          {/* users in the voice channel */}
          <div style={{ marginLeft: '20px' }}>
            {users.map(({ user }) => (
              <div key={user.username} style={{ marginTop: '15px' }}>
                <UserInformation
                  avatarConfig={{ w: '25px', h: '25px', fs: '11pt' }}
                  avatarColor={user.avatarColor}
                  avatarLetters={`${user.username
                    .split('')
                    .filter((_, i) => i < 3)
                    .join('')}`}
                  body1={user.username}
                />
              </div>
            ))}
          </div>
        </div>
      </Grid>
    );
  }
}
export default VoiceChat;
