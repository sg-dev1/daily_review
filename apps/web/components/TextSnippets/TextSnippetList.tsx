'use client';

import React, { useMemo, useState } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../app/store';
import { TextSnippedDto } from '@repo/shared';
import { Skeleton, Space, Table, TableProps } from 'antd';
import { ColumnsType, SorterResult } from 'antd/es/table/interface';
import ButtonWithConfirm from '../Utils/ButtonWithConfirm';
import { deleteTextSnippet, getTextSnippets } from '../../app/slices/textSnippetSlice';
import TextSnippetForm from './TextSnippetForm';
import useColumnSearchProps from '../Utils/useColumnSearchProps';

interface DataType extends TextSnippedDto {
  key: React.Key;
}

const TextSnippetList = () => {
  const dispatch = useAppDispatch();

  const { isAuthenticated, loading } = useAppSelector((state: RootState) => state.auth);
  const textSnippedList: TextSnippedDto[] = useAppSelector((state: RootState) => state.textSnippets.textSnippetsList);
  // Needed for the filters to set the correct data in the table and the pagination,
  //   e.g. if an filter is active, we want the filtered data source, not all data (textSnippedList / updatedTextSnippetList)
  const [currentDataSource, setCurrentDataSource] = useState<DataType[] | null>(null);

  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
  const [tablePageSize, setTablePageSize] = useState(20);
  const getColumnSearchProps = useColumnSearchProps<DataType>();

  const columns: ColumnsType<DataType> = [
    {
      title: 'Title',
      dataIndex: 'bookTitle',
      key: 'bookTitle',
      width: '20%',
      render: (text: string) => <a>{text}</a>,
      sorter: (a, b) => a.bookTitle.localeCompare(b.bookTitle),
      sortOrder: sortedInfo.columnKey === 'bookTitle' ? sortedInfo.order : null,
      ellipsis: true,
      ...getColumnSearchProps('bookTitle'),
    },
    {
      title: 'Author',
      dataIndex: 'bookAuthor',
      key: 'bookAuthor',
      width: '15%',
      render: (text: string) => <a>{text}</a>,
      sorter: (a, b) => a.bookAuthor.localeCompare(b.bookAuthor),
      sortOrder: sortedInfo.columnKey === 'bookAuthor' ? sortedInfo.order : null,
      ellipsis: true,
      ...getColumnSearchProps('bookAuthor'),
    },
    {
      title: 'Notes',
      dataIndex: 'note',
      key: 'note',
      width: '15%',
      render: (text: string) => <a>{text}</a>,
      sorter: (a, b) => a.note.localeCompare(b.note),
      sortOrder: sortedInfo.columnKey === 'note' ? sortedInfo.order : null,
      ellipsis: true,
      ...getColumnSearchProps('note'),
    },
    {
      title: 'Location (Page #)',
      dataIndex: 'location',
      key: 'location',
      width: '8%',
      render: (text: string) => <a>{text}</a>,
      sorter: (a, b) => Number(a.location) - Number(b.location),
      sortOrder: sortedInfo.columnKey === 'location' ? sortedInfo.order : null,
      ellipsis: true,
      ...getColumnSearchProps('location'),
    },
    {
      title: 'Review count',
      dataIndex: 'reviewCount',
      key: 'reviewCount',
      width: '7%',
      render: (text: string) => <a>{text}</a>,
      sorter: (a, b) => a.reviewCount - b.reviewCount,
      sortOrder: sortedInfo.columnKey === 'reviewCount' ? sortedInfo.order : null,
      ellipsis: true,
      ...getColumnSearchProps('reviewCount'),
    },
    {
      title: 'Actions',
      key: 'action',
      width: '15%',
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

  const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    const dbgTableChange = false;

    setSortedInfo(sorter as SorterResult<DataType>);
    if (dbgTableChange) {
      console.log('sorter:', sorter);
      console.log('pagination', pagination);
      console.log('filteres', filters);
    }

    // Properly handle the filter (always using the correct data source in the table)
    let filterSet = false;
    for (let k in filters) {
      if (filters[k]) {
        filterSet = true;
        break;
      }
    }
    // TODO could save the currently set filter (so it can be compared later on)
    //   --> if current filter differs to set filter --> we have filtered the wrong data (extra.currentDataSource is invalid)
    //   (see TODO in useColumnSearchProps)

    if (dbgTableChange) {
      console.log('filters set', filterSet);
      console.log('extra.currentDataSource=', extra.currentDataSource, extra);
    }
    if (filterSet) {
      setCurrentDataSource(extra.currentDataSource);
    } else {
      // no filter set --> reset the filtered datasource
      setCurrentDataSource(null);
    }
  };

  let dataSourceToUse = updatedTextSnippetList;
  if (currentDataSource !== null && currentDataSource.length !== updatedTextSnippetList.length) {
    // if filtered data source is set and its length differs from all data, use it
    dataSourceToUse = currentDataSource;
  }

  return (
    <>
      {loading && <Skeleton active />}
      {isAuthenticated && dataSourceToUse && (
        <Table
          columns={columns}
          dataSource={dataSourceToUse}
          onChange={handleTableChange}
          pagination={{
            showTotal: (total) => `Total ${dataSourceToUse.length} items.`,

            total: dataSourceToUse.length,
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
