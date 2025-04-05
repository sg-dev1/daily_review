'use client';

import React, { useEffect, useState } from 'react';
import type { TableProps } from 'antd';
import { Space, Table, Skeleton, App } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import UserForm from './UserForm';
import { RootState, useAppDispatch, useAppSelector } from '../../app/store';
import { deleteUser, getUsers } from '../../app/slices/userSlice';
import { UserDto } from '@repo/shared';
import ButtonWithConfirm from '../Utils/ButtonWithConfirm';
import useColumnSearchProps from '../Utils/useColumnSearchProps';

interface DataType extends UserDto {
  key: React.Key;
}

const UserList = () => {
  const dispatch = useAppDispatch();

  const { isAuthenticated, loading } = useAppSelector((state: RootState) => state.auth);
  const userList: UserDto[] = useAppSelector((state: RootState) => state.users.userList);
  const { message } = App.useApp();

  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
  const getColumnSearchProps = useColumnSearchProps<DataType>();
  const [tablePageSize, setTablePageSize] = useState(20);

  // Reformat time string for better display
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleString('en', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // const changeStatus = async (record: any, newStatus: 'active' | 'inactive') => {
  //   try {
  //     const changeUserStatus = await dispatch(editUser({ id: record.id, body: { status: newStatus } }));

  //     if (editUser.fulfilled.match(changeUserStatus)) {
  //       // Fetch the updated list here
  //       dispatch(getUsers());
  //     }
  //   } catch (error: any) {
  //     message.error(error);
  //   }
  // };

  const handleTableChange: TableProps<DataType>['onChange'] = (_, __, sorter) => {
    setSortedInfo(sorter as SorterResult<DataType>);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: '20%',
      render: (text: string) => <a>{text}</a>,
      sorter: (a, b) => a.username.localeCompare(b.username),
      sortOrder: sortedInfo.columnKey === 'username' ? sortedInfo.order : null,
      ellipsis: true,
      ...getColumnSearchProps('username'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortOrder: sortedInfo.columnKey === 'email' ? sortedInfo.order : null,
      ellipsis: true,
      ...getColumnSearchProps('email'),
    },
    // {
    //   title: dict?.settings.lastUpdated,
    //   dataIndex: 'updatedAt',
    //   key: 'updatedAt',
    //   width: '25%',
    //   render: (text: string) => <p>{formatTime(text)}</p>,
    //   sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    //   sortOrder: sortedInfo.columnKey === 'updatedAt' ? sortedInfo.order : null,
    //   ellipsis: true,
    // },
    {
      title: 'Status',
      dataIndex: 'isDisabled',
      key: 'isDisabled',
      width: '15%',
      render: (value: boolean) => <p>{value ? 'inactive' : 'active'}</p>,
      filters: [
        {
          text: 'inactive',
          value: true,
        },
        {
          text: 'active',
          value: false,
        },
      ],
      onFilter: (value, record) => record.isDisabled === value,
    },
    {
      title: 'Role',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      width: '15%',
      render: (value: boolean) => <p>{value ? 'Admin' : 'Normal'}</p>,
      filters: [
        {
          text: 'Admin',
          value: true,
        },
        {
          text: 'Normal',
          value: false,
        },
      ],
      onFilter: (value, record) => record.isAdmin === value,
    },
    {
      title: 'Actions',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <Space size="middle">
          <UserForm title={'Edit'} buttonText={'Edit'} user={record} variant="edit" />

          <ButtonWithConfirm
            handleOk={async () => {
              await dispatch(deleteUser(record.id));
              dispatch(getUsers());
            }}
            handleCancle={() => {}}
            title={'Delete'}
            description={`Do you want to delete the user '${record.username}'`}
            danger
            type={'primary'}
          >
            Delete
          </ButtonWithConfirm>
        </Space>
      ),
    },
  ];

  // Add a unique key property to each element and sort list by user ID
  let updatedUserList;
  if (userList) {
    updatedUserList = [...userList]
      .sort((a: any, b: any) => a.id - b.id) // Sorting by ID
      .map((item: any, index: number) => ({
        ...item,
        key: index,
        role: item.isAdmin ? 'Admin' : 'Normal',
      }));
  }

  useEffect(() => {
    if (dispatch !== undefined && isAuthenticated && loading !== undefined && !loading) {
      dispatch(getUsers());
    }
  }, [isAuthenticated, dispatch, loading]);

  return (
    <>
      {loading && <Skeleton active />}
      {isAuthenticated && updatedUserList && (
        <Table
          columns={columns}
          dataSource={updatedUserList}
          onChange={handleTableChange}
          pagination={{
            showTotal: (total) => `Total ${userList.length} items.`,

            total: userList.length,
            pageSize: tablePageSize,
            pageSizeOptions: ['5', '10', '15', '20', '30', '50'], // Allow users to select 10, 20, 30, or 50 rows per page
            showSizeChanger: true, // Show the page size changer dropdown
            onChange: (_, pageSize) => {
              setTablePageSize(pageSize);
            },
          }}
        />
      )}
    </>
  );
};

export default UserList;
