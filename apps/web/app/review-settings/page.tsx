'use client';

import React from 'react';
import { useAppSelector } from '../store';
import { selectUser } from '../slices/authSlice';
import ReviewSettings from '../../components/Settings/ReviewSettings';
import { stringToHash } from '../../components/Utils/hashUtils';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

const ReviewSettingsPage = () => {
  const router = useRouter();
  const user = useAppSelector(selectUser);

  return (
    <div style={{ margin: '16px', backgroundColor: '#F2F2F2', padding: '16px' }}>
      <h1 style={{ marginBottom: '32px' }}>Review Settings</h1>

      <ReviewSettings user={user} key={stringToHash(JSON.stringify(user))} />

      <Button
        onClick={() => {
          router.push('/');
        }}
      >
        Back
      </Button>
    </div>
  );
};

export default ReviewSettingsPage;
