'use client';

import React, { useEffect, useState, useRef } from 'react';
import type { TableProps } from 'antd';
import { Button, Space, Table, Skeleton, InputRef, Input, App } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { SorterResult, FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';
import UserForm from './UserForm';
import { RootState, useAppDispatch, useAppSelector } from '../../app/store';
import { deleteUser, getUsers } from '../../app/slices/userSlice';
import { UserDto } from '@repo/shared';
import ButtonWithConfirm from '../Utils/ButtonWithConfirm';

interface DataType {
  key: React.Key;
  name: string;
  email: string;
  age: number;
  address: string;
  username: string;
  status: 'active' | 'inactive';
  id: number;
  isAdmin: boolean;
  updatedAt: string;
}

type DataIndex = keyof DataType;

const UserList = () => {
  const dispatch = useAppDispatch();

  const { isAuthenticated, loading } = useAppSelector((state: RootState) => state.auth);
  const userList: UserDto[] = useAppSelector((state: RootState) => state.users.userList);
  const { message } = App.useApp();

  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
  // const [searchText, setSearchText] = useState('');
  // const [searchedColumn, setSearchedColumn] = useState('');
  // const searchInput = useRef<InputRef>(null);
  const [tablePageSize, setTablePageSize] = useState(20);

  // const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps['confirm'], dataIndex: DataIndex) => {
  //   confirm();
  //   setSearchText(selectedKeys[0] as string);
  //   setSearchedColumn(dataIndex);
  // };

  // const handleReset = (clearFilters: () => void, confirm: FilterDropdownProps['confirm'], dataIndex: DataIndex) => {
  //   clearFilters();
  //   setSearchText('');
  //   handleSearch([], confirm, dataIndex);
  // };

  // interface Correction {
  //   [key: string]: string;
  // }

  // const correction: Correction = {
  //   name: `${dict?.settings.name}`,
  //   username: `${dict?.settings.username}`,
  //   email: `${dict?.settings.email}`,
  // };

  // const reg = new RegExp(Object.keys(correction).join('|'), 'g');

  // const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
  //   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
  //     <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
  //       <Input
  //         ref={searchInput}
  //         placeholder={`${dict?.placeholder.search} ${String(dataIndex).replace(reg, (matched) => correction[matched])}`}
  //         value={selectedKeys[0]}
  //         onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
  //         onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
  //         style={{ marginBottom: 8, display: 'block' }}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
  //           icon={<SearchOutlined />}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           {dict?.buttons_general.search}
  //         </Button>
  //         <Button
  //           onClick={() => clearFilters && handleReset(clearFilters, confirm, dataIndex)}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           {dict?.buttons_general.reset}
  //         </Button>
  //         <Button
  //           type="link"
  //           size="small"
  //           onClick={() => {
  //             confirm({ closeDropdown: false });
  //             setSearchText((selectedKeys as string[])[0] as string);
  //             setSearchedColumn(dataIndex);
  //           }}
  //         >
  //           {dict?.buttons_general.filter}
  //         </Button>
  //         <Button
  //           type="link"
  //           size="small"
  //           onClick={() => {
  //             close();
  //           }}
  //         >
  //           {dict?.buttons_general.close}
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
  //   onFilter: (value, record) =>
  //     record[dataIndex]
  //       .toString()
  //       .toLowerCase()
  //       .includes((value as string).toLowerCase()),
  //   filterDropdownProps: {
  //     onOpenChange(visible) {
  //       if (visible) {
  //         setTimeout(() => searchInput.current?.select(), 100);
  //       }
  //     },
  //   },
  //   render: (text) =>
  //     searchedColumn === dataIndex ? (
  //       <Highlighter
  //         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
  //         searchWords={[searchText]}
  //         autoEscape
  //         textToHighlight={text ? text.toString() : ''}
  //       />
  //     ) : (
  //       text
  //     ),
  // });

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
      width: '13%',
      render: (text: string) => <a>{text}</a>,
      sorter: (a, b) => a.username.length - b.username.length,
      sortOrder: sortedInfo.columnKey === 'username' ? sortedInfo.order : null,
      ellipsis: true,
      // ...getColumnSearchProps('username'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '15%',
      sorter: (a, b) => a.email.length - b.email.length,
      sortOrder: sortedInfo.columnKey === 'email' ? sortedInfo.order : null,
      ellipsis: true,
      // ...getColumnSearchProps('email'),
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
    // {
    //   title: dict?.settings.status,
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: '8%',
    //   render: (text: 'active' | 'inactive') => <p>{dict?.settings[text]}</p>,
    //   filters: [
    //     {
    //       text: dict?.settings.active,
    //       value: 'active',
    //     },
    //     {
    //       text: dict?.settings.inactive,
    //       value: 'inactive',
    //     },
    //   ],
    //   onFilter: (value, record) => record.status === value,
    // },
    {
      title: 'Role',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      width: '8%',
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
          {/* {record.status === 'active' ? (
            <Button onClick={() => changeStatus(record, 'inactive')} type="default">
              {dict?.settings.disable}
            </Button>
          ) : (
            <Button onClick={() => changeStatus(record, 'active')} type="default">
              {dict?.settings.enable}
            </Button>
          )} */}
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
