'use client';

import React, { useState, useEffect } from 'react';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Space, Row, Col, Select, Form, Input, Drawer, App } from 'antd';
import { useAppDispatch } from '../../app/store';
import { createUser, getUsers, updateUser } from '../../app/slices/userSlice';

const { Option } = Select;

type UserType = {
  name: string;
  username: string;
  email: string;
  isAdmin: boolean;
  status: 'active' | 'inactive';
  id: number;
};

const UserForm = ({
  buttonText,
  title,
  user,
  variant,
}: {
  buttonText?: string;
  title?: string;
  user?: UserType;
  variant: 'register' | 'edit';
}) => {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      let action;
      switch (variant) {
        case 'register':
          action = await dispatch(
            createUser({
              username: values.username,
              email: values.email,
              password: values.password,
              isAdmin: values.role,
            })
          );
          break;
        case 'edit':
          action =
            user &&
            (await dispatch(
              updateUser({
                id: user.id,
                username: values.username,
                email: values.email,
                password: values.password,
                isAdmin: values.role,
              })
            ));
          break;
      }

      if (action && (updateUser.fulfilled.match(action) || createUser.fulfilled.match(action))) {
        // Fetch the updated list here
        dispatch(getUsers());
        setOpen(false);
        form.resetFields();
      }
    } catch (error: any) {
      message.error(error);
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      form.submit();
    }
  };

  // Set initial form values when component mounts or user changes
  useEffect(() => {
    form.setFieldsValue({
      name: user?.name ?? '',
      username: user?.username ?? '',
      email: user?.email ?? '',
      role: user?.isAdmin ?? false, // Set the default value for the role
      status: user?.status ?? 'active', // Set the default value for the status
    });
  }, [user, form]);

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        {buttonText}
      </Button>
      <Drawer
        title={title}
        forceRender
        open={open}
        onClose={handleCancel}
        width={720}
        style={{ borderRadius: 8 }}
        closeIcon={null}
        extra={
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleOk} type="primary">
              Ok
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          name={user?.username ? `form-edit-${user?.username}` : 'form-register-user'}
          className="login-form"
          onFinish={handleSubmit}
          onKeyDown={handleKeyDown}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label={'Email'}
                rules={[{ required: true, type: 'email', message: 'Fill in your email address' }]}
              >
                <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder={'user@example.com'} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label={'Username'}
                rules={[{ required: true, message: 'Fill in your username' }]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder={'Username'} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label={'Password'}
                hasFeedback
                rules={[
                  {
                    required: variant === 'register' || !!form.getFieldValue('confirmPassword'),
                    message: 'Fill in your password',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder={'Password'}
                />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item
                name="confirmPassword"
                label={dict?.confirmPassword}
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: variant === 'register' || !!form.getFieldValue('password'),
                    message: dict?.confirmPasswordPrompt,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(dict?.passwordNotMatch));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder={dict?.confirmPassword}
                />
              </Form.Item>
            </Col> */}
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="role" label={'Role'} rules={[{ required: true }]}>
                <Select>
                  <Option value={false}>Normal</Option>
                  <Option value={true}>Admin</Option>
                </Select>
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Select>
                  <Option value="active">{dict?.active}</Option>
                  <Option value="inactive">{dict?.inactive}</Option>
                </Select>
              </Form.Item>
            </Col> */}
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default UserForm;
