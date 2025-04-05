'use client';

import React, { useEffect, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { App, Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { RootState, useAppDispatch, useAppSelector } from '../../app/store';
import { loginUser } from '../../app/slices/authSlice';

const LoginForm = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const { message } = App.useApp();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      dispatch(loginUser({ username, password }));
    } catch (error) {
      message.error('An error occurred. Please try again');
    }
  };

  const handleCheckboxChange = (e: any) => {
    setRemember(e.target.checked);
  };

  useEffect(() => {
    // if login successful redirect user to dashboard and show success message
    if (router !== undefined && isAuthenticated) {
      //console.log('login successful');
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Form name="normal_login" className="login-form" initialValues={{ remember: remember }} onFinish={handleSubmit}>
        <Form.Item name="username" rules={[{ required: true, message: 'Fill in the username.' }]}>
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder={'Username'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Fill in the password.' }]}>
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder={'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        {/* <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox onChange={handleCheckboxChange} checked={remember}>{dict.rememberMe}</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item> */}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{ marginRight: '0.625rem' }}
            disabled={loading}
          >
            {loading ? 'Log in...' : 'Log in'}
          </Button>
          {/* Or <a href="">register now!</a> */}
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginForm;
