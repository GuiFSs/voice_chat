import React, { useState } from 'react';
import { TextField } from '@material-ui/core';

// TODO: create events when user is typing, create the message when someone press ENTER
const TextArea = ({ sendMessage }) => {
  const [txtValue, setTxtValue] = useState('');

  const handleEnterPressed = () => {
    sendMessage(txtValue);
    setTimeout(() => {
      setTxtValue('');
    }, 1);
  };

  return (
    <TextField
      style={{
        position: 'fixed',
        width: '72% ',
        bottom: '10px',
        marginLeft: '20px',
        backgroundColor: '#484C52'
      }}
      onChange={e => setTxtValue(e.target.value)}
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
