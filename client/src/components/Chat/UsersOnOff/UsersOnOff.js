import React from 'react';
import { Grid, Typography, Avatar } from '@material-ui/core';
import * as muiColors from '@material-ui/core/colors/';

const getRandomMUIColor = () => {
  const keys = Object.keys(muiColors);
  const rnd = Math.floor(Math.random() * keys.length);
  return muiColors[keys[rnd]][500];
};

const UsersOnOff = ({ onlineUsers, usersOfTheRoom }) => {
  // TODO: make offline users
  let offlineUsers = [];

  return (
    <Grid
      style={{
        border: '2px solid black',
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
          variant='subheading'
          gutterBottom
        >
          ONLINE-{onlineUsers && onlineUsers.length}
        </Typography>
        {onlineUsers.length > 0 &&
          onlineUsers.map(({ user }) => (
            <Grid item key={user._id}>
              <Avatar
                sizes='50px'
                style={{
                  float: 'left',
                  marginRight: '10px',
                  marginBottom: '10px',
                  backgroundColor: getRandomMUIColor()
                }}
              >
                {user.username[0] + user.username[1]}
              </Avatar>
              <Typography style={{ width: '300px' }} variant='body1'>
                {user.username}
              </Typography>
              <Typography style={{ width: '300px' }} variant='caption'>
                Listening to spotify
              </Typography>
            </Grid>
          ))}

        <Typography
          style={{ textAlign: 'left' }}
          variant='subheading'
          gutterBottom
        >
          OFFLINE-{offlineUsers.length}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default UsersOnOff;
