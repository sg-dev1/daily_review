import React from 'react';
import LoginForm from '../../components/Settings/LoginForm';

const LoginPage = () => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '80vh',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '20rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: '32px' }}>Login</h1>
        <LoginForm />
      </div>
    </>
  );
};

export default LoginPage;
