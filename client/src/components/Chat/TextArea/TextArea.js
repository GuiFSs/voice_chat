import React, { useState } from 'react';
import { TextField } from '@material-ui/core';

// TODO: create events when user is typing, create the message when someone press ENTER
const TextArea = ({ sendMessage, socket, username }) => {
  const [txtValue, setTxtValue] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [typingTimer, setTypingTimer] = useState([]);
  const [typingUser, setTypingUser] = useState(false);

  const handleEnterPressed = () => {
    const trimValue = txtValue.trim();
    if (trimValue.legth === 0 || trimValue === '') return;
    setTypingUser(false);
    sendMessage(txtValue);
    setTimeout(() => {
      setTxtValue('');
      socket.emit('stop typing', username);
    }, 1);
  };

  const handleChange = value => {
    // TODO: make a good typing system :(
    setTxtValue(value);
    if (!typingUser) {
      socket.emit('typing', username);
      setTypingUser(true);
    }
  };
  return (
    <TextField
      style={{
        position: 'fixed',
        width: '67% ',
        bottom: '5px',
        marginLeft: '17%',
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
