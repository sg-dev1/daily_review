'use client';

import React, { useEffect } from 'react';
import { Nav } from './Layout/Nav';
import { useAppDispatch, useAppSelector } from '../app/store';
import { selectAuth } from '../app/slices/authSlice';
import { getTextSnippets } from '../app/slices/textSnippetSlice';
import TextSnippetList from './TextSnippets/TextSnippetList';
import TextSnippetForm from './TextSnippets/TextSnippetForm';

const MainPage = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectAuth);

  useEffect(() => {
    dispatch(getTextSnippets());
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <div style={{ backgroundColor: '#F2F2F2', flex: '1', padding: '32px' }}>
        <h1 style={{ marginBottom: '32px' }}>Text Snippets</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <TextSnippetForm variant="create" />
        </div>
        <TextSnippetList />
      </div>
    </div>
  );
};

export default MainPage;
