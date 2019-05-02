import React, { useState } from 'react';

const PeerConnection = ({ socket, myPeer }) => {
  if (!myPeer) return;
  const [audiosEl, setAudiosEl] = useState([]);

  let othersPeersId = [];

  const creteNewAudioEl = (peer, remoteStream) => {
    const audioElAlreadyExists = audiosEl
      .map(audio => audio && audio.props && audio.props.split('_')[2] === peer)
      .includes(true);
    if (audioElAlreadyExists) return;
    const newAudiosEl = [...audiosEl];
    const id = `other_audio_${peer}`;
    newAudiosEl.push({
      id,
      remoteStream
    });
    setAudiosEl(newAudiosEl);
  };

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
        creteNewAudioEl(call.peer, remoteStream);
      });
    });
  };

  const callToPeer = async id => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
    const call = myPeer.call(id, stream, {
      constraints: {
        mandatoty: { OfferToReceiveAudio: true, OfferToReceiveVideo: true }
      }
    });

    console.log('nova call with:', call.peer);
    call.on('stream', function(remoteStream) {
      creteNewAudioEl(call.peer, remoteStream);
    });
  };

  const connectPeerWith = id => {
    const conn = myPeer.connect(id);
    // on open will be launch when you successfully connect to PeerServer
    conn.on('open', () => {
      conn.send('hello new user!');
    });
  };

  myPeerFunctions();

  socket.on('get other peer id', data => {
    if (!othersPeersId.includes(data) && data !== myPeer.id) {
      othersPeersId.push(data);
      callToPeer(data);
      connectPeerWith(data);
    }
  });

  return (
    <div id='audio_peers'>
      {console.log('audios: ', audiosEl)}
      <h1>
        {audiosEl.map(aud => (
          <audio
            key={aud.id}
            id={aud.id}
            autoPlay={true}
            ref={audio => {
              if (audio) {
                audio.srcObject = aud.remoteStream;
              }
            }}
          />
        ))}
      </h1>
    </div>
  );
};

export default PeerConnection;
