import React from 'react';
import { Avatar, Typography } from '@material-ui/core';
import { formatDate } from '../utils/utils';

import './UserInformation.css';

const UserInformation = ({
  avatarColor,
  avatarLetters,
  body1,
  caption,
  date,
  onUserOnClick
}) => {
  if (date) {
    date = formatDate(date);
  }

  return (
    <div>
      <Avatar
        onClick={onUserOnClick}
        id='avatar-user-on'
        sizes='50px'
        style={{
          float: 'left',
          marginRight: '10px',
          marginBottom: '10px',
          backgroundColor: avatarColor
        }}
      >
        {avatarLetters}
      </Avatar>
      <Typography
        style={{ width: '300px', marginRight: '5px', color: '#3598DB' }}
        inline={true}
        variant='body1'
      >
        {body1}{' '}
        {date && (
          <Typography
            inline={true}
            style={{ opacity: 'initial', fontSize: '10pt', color: '#636161' }}
            variant='caption'
          >
            {date}
          </Typography>
        )}
      </Typography>

      {caption && (
        <Typography style={{ width: '300px' }} variant='caption'>
          {caption}
        </Typography>
      )}
    </div>
  );
};

export default UserInformation;
