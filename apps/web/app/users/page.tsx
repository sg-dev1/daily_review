'use client';

import React from 'react';
import UserForm from '../../components/Settings/UserForm';
import UserList from '../../components/Settings/UserList';
import '@ant-design/v5-patch-for-react-19';

const Users = () => {
  return (
    <>
      <h1 style={{ marginBottom: '32px' }}>Users</h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <UserForm variant="register" title={'Register'} buttonText="Register" />
      </div>
      <UserList />
    </>
  );
};

export default Users;
