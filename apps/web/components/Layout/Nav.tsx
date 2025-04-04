'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MenuProps, Popover } from 'antd';
import { Layout, Menu, theme, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { AppDispatch, useAppDispatch, useAppSelector } from '../../app/store';
import { getUser, selectAuth, selectUser } from '../../app/slices/authSlice';
import AppAvatar from '../Settings/AppAvatar';

const { Header } = Layout;

export const Nav = () => {
  const dispatch = useAppDispatch<AppDispatch>();
  const isAuthenticated = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const pathname = usePathname();
  const pathWithoutLocale = pathname.split('/').slice(2).join('/');

  useEffect(() => {
    dispatch(getUser());
    //sessionExpiredInterceptor();
  }, [isAuthenticated]);

  // Keys must be named accroding to the navigation in order for the selection of the menu items to work accordingly
  // If this is not done, the wrong menu item will be marked as currently selected
  const menuItems: MenuProps['items'] = [
    // {
    //   key: 'settings',
    //   label: user && user.isAdmin && <Settings dict={dict} />,
    // },
    {
      key: 'login',
      label: user ? (
        <Popover
          align={{ offset: [0, -15] }}
          arrow={false}
          trigger="click"
          content={
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <h4>{user.username}</h4>
              <Button
                shape="round"
                icon={<LogoutOutlined />}
                onClick={() => {
                  console.log('logout not supported');
                  //dispatch(logoutUser());
                }}
              >
                Logout
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', height: '4rem', alignItems: 'center' }}>
            <AppAvatar user={user} group="login"></AppAvatar>
          </div>
        </Popover>
      ) : (
        <Link href={`/login`}>Login</Link>
      ),
    },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          display: 'flex',
          justifyContent: 'space-between',
          zIndex: 1,
          width: '100%',
          alignItems: 'center',
          background: 'white',
          borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
        }}
      >
        <Link href={`/`} style={{ display: 'flex', alignItems: 'center', color: 'black' }}>
          <h3 style={{ marginTop: 0, marginBottom: 0, marginLeft: '2rem' }}>APP</h3>
        </Link>
        <Menu
          disabledOverflow={true}
          theme="light"
          mode="horizontal"
          selectedKeys={[pathWithoutLocale]}
          items={menuItems}
        />
      </Header>
    </>
  );
};
