import React, { useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import UserInformation from '../../UserInformation/UserInformation';

const UsersOnOff = ({
  onlineUsers,
  usersOfTheRoom,
  avatarColor,
  socket,
  onUserOnClick
}) => {
  // TODO: make offline users
  let offlineUsers = [];

  const [typingUsers, setTypingUsers] = useState([]);

  socket.on('typing', data => {
    const newTyping = [...typingUsers];
    newTyping.push(data);
    setTypingUsers(newTyping);
  });

  socket.on('stop typing', data => {
    const newTyping = [...typingUsers];
    const index = newTyping.indexOf(data);
    newTyping.splice(index, 1);
    setTypingUsers(newTyping);
  });

  return (
    <Grid
      style={{
        backgroundColor: '#2F3136',
        padding: '20px'
      }}
      xs={6}
      sm={3}
      item
    >
      <Grid
        container
        direction='column'
        justify='center'
        alignItems='flex-start'
        spacing={8}
        style={{ position: 'fixed' }}
      >
        <Typography
          style={{ textAlign: 'left' }}
          variant='subtitle1'
          gutterBottom
        >
          ONLINE-{onlineUsers && onlineUsers.length}
        </Typography>
        {onlineUsers.length > 0 &&
          onlineUsers.map(({ user }) => (
            <Grid item key={user._id}>
              <UserInformation
                onUserOnClick={onUserOnClick}
                avatarColor={'#DD4A93'}
                avatarLetters={user.username[0] + user.username[1]}
                body1={user.username}
                caption={typingUsers.includes(user.username) && 'typing...'}
              />
            </Grid>
          ))}
        <Typography
          style={{ textAlign: 'left' }}
          variant='subtitle1'
          gutterBottom
        >
          OFFLINE-{offlineUsers.length}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default UsersOnOff;
