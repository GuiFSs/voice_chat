import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import Message from './Message/Message';
class Messages extends Component {
  render() {
    return (
      <Grid xs={6} sm={9} style={{ border: '2px solid red' }} item>
        <Message />
      </Grid>
    );
  }
}
export default Messages;
