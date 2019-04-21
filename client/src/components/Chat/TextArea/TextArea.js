import React from 'react';
import { TextField } from '@material-ui/core';

// TODO: create events when user is typing, create the message when someone press ENTER
const TextArea = () => {
  return (
    <TextField
      style={{
        position: 'fixed',
        width: '72% ',
        bottom: '10px',
        marginLeft: '20px',
        backgroundColor: '#484C52'
      }}
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
