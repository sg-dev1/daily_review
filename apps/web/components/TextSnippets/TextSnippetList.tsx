'use client';

import React, { useMemo, useState } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../app/store';
import { TextSnippedDto } from '@repo/shared';
import { Skeleton, Space, Table, TableProps } from 'antd';
import { ColumnsType, SorterResult } from 'antd/es/table/interface';
import ButtonWithConfirm from '../Utils/ButtonWithConfirm';
import { deleteTextSnippet, getTextSnippets } from '../../app/slices/textSnippetSlice';
import TextSnippetForm from './TextSnippetForm';

interface DataType extends TextSnippedDto {
  key: React.Key;
}

const TextSnippetList = () => {
  const dispatch = useAppDispatch();

  const { isAuthenticated, loading } = useAppSelector((state: RootState) => state.auth);
  const textSnippedList: TextSnippedDto[] = useAppSelector((state: RootState) => state.textSnippets.textSnippetsList);

  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
  const [tablePageSize, setTablePageSize] = useState(20);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Title',
      dataIndex: 'bookTitle',
      key: 'bookTitle',
      //width: '13%',
      render: (text: string) => <a>{text}</a>,
      sorter: (a, b) => a.bookTitle.localeCompare(b.bookTitle),
      sortOrder: sortedInfo.columnKey === 'bookTitle' ? sortedInfo.order : null,
      ellipsis: true,
      // ...getColumnSearchProps('bookTitle'),
    },
    {
      title: 'Author',
      dataIndex: 'bookAuthor',
      key: 'bookAuthor',
      //width: '13%',
      render: (text: string) => <a>{text}</a>,
      sorter: (a, b) => a.bookAuthor.localeCompare(b.bookAuthor),
      sortOrder: sortedInfo.columnKey === 'bookAuthor' ? sortedInfo.order : null,
      ellipsis: true,
      // ...getColumnSearchProps('bookAuthor'),
    },
    {
      title: 'Location (Page #)',
      dataIndex: 'location',
      key: 'location',
      //width: '13%',
      render: (text: string) => <a>{text}</a>,
      sorter: (a, b) => a.location.localeCompare(b.location),
      sortOrder: sortedInfo.columnKey === 'location' ? sortedInfo.order : null,
      ellipsis: true,
      // ...getColumnSearchProps('location'),
    },
    {
      title: 'Review count',
      dataIndex: 'reviewCount',
      key: 'reviewCount',
      //width: '13%',
      render: (text: string) => <a>{text}</a>,
      sorter: (a, b) => a.reviewCount - b.reviewCount,
      sortOrder: sortedInfo.columnKey === 'reviewCount' ? sortedInfo.order : null,
      ellipsis: true,
      // ...getColumnSearchProps('reviewCount'),
    },
    {
      title: 'Actions',
      key: 'action',
      //width: '20%',
      render: (_, record) => (
        <Space size="middle">
          <TextSnippetForm variant="update" textSnippet={record} />

          <ButtonWithConfirm
            handleOk={async () => {
              await dispatch(deleteTextSnippet(record.id));
              dispatch(getTextSnippets());
            }}
            handleCancle={() => {}}
            title={'Delete'}
            description={`Do you want to delete the text snippet from '${record.bookTitle} by ${record.bookAuthor}'`}
            danger
            type={'primary'}
          >
            Delete
          </ButtonWithConfirm>
        </Space>
      ),
    },
  ];
  // text and note better to show in a sider

  const updatedTextSnippetList = useMemo(() => {
    return (
      textSnippedList
        //.sort((a: any, b: any) => a.id - b.id) // Sorting by ID
        .map((item: any, index: number) => ({
          ...item,
          key: index,
        }))
    );
  }, [textSnippedList]);

  const handleTableChange: TableProps<DataType>['onChange'] = (_, __, sorter) => {
    setSortedInfo(sorter as SorterResult<DataType>);
  };

  return (
    <>
      {loading && <Skeleton active />}
      {isAuthenticated && updatedTextSnippetList && (
        <Table
          columns={columns}
          dataSource={updatedTextSnippetList}
          onChange={handleTableChange}
          pagination={{
            showTotal: (total) => `Total ${updatedTextSnippetList.length} items.`,

            total: updatedTextSnippetList.length,
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

export default TextSnippetList;
