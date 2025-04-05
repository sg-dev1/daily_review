'use client';

import React from 'react';
import UserForm from '../../components/Settings/UserForm';
import UserList from '../../components/Settings/UserList';

const Users = () => {
  return (
    <div style={{ margin: '16px' }}>
      <h1 style={{ marginBottom: '32px' }}>Users</h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <UserForm variant="register" title={'Create new user'} buttonText="Create new user" />
      </div>
      <UserList />
    </div>
  );
};

export default Users;
