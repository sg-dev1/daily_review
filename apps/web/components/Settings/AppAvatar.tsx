'use client';

import React from 'react';
import { Tooltip, Avatar } from 'antd';
import { blue, purple, magenta, green, cyan, gold, yellow, lime, orange } from '@ant-design/colors';
import { UserDto } from '@repo/shared';

const camelize = (str: string): string => {
  if (str.length === 1) return str.toUpperCase();
  let result: string = str.slice(0, 1).toUpperCase() + str.slice(1).toLocaleLowerCase();
  return result;
};

const getInitials = (username: string): string => {
  if (!username) return '';
  let parts = username.split(' ');
  if (parts.length === 1) {
    parts = username.split('_');
    if (parts.length === 1) {
      return camelize(username.substring(0, 5));
    }
  }
  return parts.map((word) => camelize(word.substring(0, 2))).join('');
};

const getAvatarColor = (username: string): string => {
  if (!username) return '';
  const colours = [
    ...blue.slice(6),
    ...purple.slice(6),
    ...magenta.slice(6),
    ...green.slice(6),
    ...cyan.slice(6),
    ...gold.slice(6),
    ...yellow.slice(6),
    ...lime.slice(6),
    ...orange.slice(6),
  ];
  // this is NOT a great hash but serves as an example
  let sum: number = 0;
  for (let i = 0; i < username.length; i++) {
    sum += username.charCodeAt(i);
  }
  return colours[sum % colours.length] as string;
};

const AppAvatar: React.FC<{ user: UserDto; group: string }> = ({ user, group }) => {
  return (
    <Tooltip mouseEnterDelay={0.5} mouseLeaveDelay={0.5} title={user?.email}>
      <Avatar
        key={group + '_' + user?.username}
        style={{ backgroundColor: getAvatarColor(user?.email), verticalAlign: 'top' }}
        size={45}
      >
        {' '}
        {getInitials(user?.username)}{' '}
      </Avatar>
    </Tooltip>
  );
};
export default AppAvatar;
