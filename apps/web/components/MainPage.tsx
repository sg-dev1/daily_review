import React from 'react';
import { Nav } from './Layout/Nav';

const MainPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <div style={{ backgroundColor: '#F2F2F2', flex: '1' }}>MainPage</div>
    </div>
  );
};

export default MainPage;
