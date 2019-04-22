import React, { useState } from 'react';
import { TextField } from '@material-ui/core';

// TODO: create events when user is typing, create the message when someone press ENTER
const TextArea = ({ sendMessage, socket, username }) => {
  const [txtValue, setTxtValue] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [typingTimer, setTypingTimer] = useState([]);

  const handleEnterPressed = () => {
    sendMessage(txtValue);
    setTimeout(() => {
      setTxtValue('');
    }, 1);
  };

  const handleChange = value => {
    // TODO: make a good typing system :(
    // setTxtValue(value);
    // socket.emit('typing', username);
  };
  return (
    <TextField
      style={{
        position: 'fixed',
        width: '72% ',
        bottom: '5px',
        marginLeft: '20px',
        backgroundColor: '#484C52'
      }}
      onChange={e => handleChange(e.target.value)}
      onKeyPress={e => (e.key === 'Enter' ? handleEnterPressed() : '')}
      value={txtValue}
      placeholder='Message #knéél-generél'
      multiline
      fullWidth
      rows='2'
      margin='normal'
      variant='outlined'
    />
  );
};

export default TextArea;
