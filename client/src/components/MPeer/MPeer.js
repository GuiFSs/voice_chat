import React from 'react';
import Peer from 'peerjs';

const MPeer = ({ socket }) => {
  let myPeer = null;
  let audiosEl = [];

  let othersPeersId = [];

  socket.on('new user', () => {
    myPeer = new Peer();
    myPeer.on('open', id => {
      console.log('sou novo, olha meu id:', id);

      socket.emit('add new peer', id);
    });

    myPeerFunctions();
  });

  socket.on('get other peer id', data => {
    if (!othersPeersId.includes(data) && data !== myPeer.id) {
      othersPeersId.push(data);
      connectPeerWith(data);
      callToPeer(data);
    }
  });

  const myPeerFunctions = () => {
    myPeer.on('connection', conn => {
      conn.on('data', data => {
        console.log('yeah, print from othres:', data);
      });
    });

    myPeer.on('call', async call => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      call.answer(stream);
      call.on('stream', remoteStream => {
        audiosEl.push(
          <audio
            id={`other_audio_${call.peer}`}
            autoPlay
            srcObject={remoteStream}
          />
        );
      });
    });
  };

  const callToPeer = async id => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
    const call = myPeer.call(id, stream);
    console.log('nova call:', call);
    call.on('stream', function(remoteStream) {
      audiosEl.push(
        <audio id={`other_audio_${id}`} autoPlay srcObject={remoteStream} />
      );
    });
  };

  const connectPeerWith = id => {
    const conn = myPeer.connect(id);
    // on open will be launch when you successfully connect to PeerServer
    conn.on('open', () => {
      conn.send('hello new user!');
    });
  };

  return (
    <div id='audio_peers'>
      <h1>{audiosEl}</h1>
    </div>
  );
};

export default MPeer;
