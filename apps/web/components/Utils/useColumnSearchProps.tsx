'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button, Space, InputRef, Input } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import type { FilterConfirmProps, FilterDropdownProps } from 'antd/es/table/interface';
import { clear } from 'console';

/**
 * React hook that provides search functionality for tables.
 * To be called in the columns: ColumnsType<DataType> definition for the antd table,
 * examples see below.
 *
 * @param DataType The datatype used with the table, e.g. ColumnsType<DataType>
 * @return getColumnSearchProps function with following parameters
 *   dataIndex: DataIndex ... The data index to use, e.g. key of DataType.
 *   getStringRep         ... Get the string representation of the record, default: String(record[dataIndex])
 *   objToString          ... Get the string representation of the object, default: String(obj)
 *
 * For usage examples see UserList.tsx and SupportList.tsx, e.g.
 *   ...getColumnSearchProps('username'),
 *   ...getColumnSearchProps(
 *      'facility',
 *      (record, dataIndex) => String(record.facility?.name),
 *       (obj) => obj.name
 *      ),
 *
 */
function useColumnSearchProps<DataType>() {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  type DataIndex = keyof DataType;

  const handleSearch = useCallback(
    (
      selectedKeys: string[],
      confirm: FilterDropdownProps['confirm'],
      dataIndex: DataIndex,
      clearFilters: (() => void) | null,
      confirmProp?: FilterConfirmProps
    ) => {
      if (searchText !== '' && searchedColumn !== '') {
        if (clearFilters !== null) {
          clearFilters();
        }
      }
      confirm(confirmProp);
      setSearchText(selectedKeys[0] as string);
      setSearchedColumn(String(dataIndex));
    },
    []
  );

  const handleReset = useCallback(
    (clearFilters: (() => void) | null, confirm: FilterDropdownProps['confirm'], dataIndex: DataIndex) => {
      if (clearFilters !== null) {
        clearFilters();
      }
      setSearchText('');
      handleSearch([], confirm, dataIndex, clearFilters);
      setSearchedColumn('');
    },
    [handleSearch]
  );

  interface Correction {
    [key: string]: string;
  }

  const getColumnSearchProps = useCallback(
    (
      dataIndex: DataIndex,
      getStringRep: (record: DataType, dataIndex: DataIndex) => string = (record: DataType, dataIndex: DataIndex) =>
        String(record[dataIndex]),
      objToString: (obj: any) => string = (obj: any) => String(obj)
    ): ColumnType<DataType> => {
      // const correction: Correction = {
      //   displayed_name: `${dict?.conceptualUnits.name}`,
      //   description: `${dict?.conceptualUnits.description}`,
      //   group: `${dict?.conceptualUnits.group}`,
      //   number_of_tags: `${dict?.conceptualUnits.numberOfTags}`,
      // };

      //const reg = new RegExp(Object.keys(correction).join('|'), 'g');

      return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
              ref={searchInput}
              placeholder={`Search `}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex, clearFilters ? clearFilters : null)
              }
              style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() =>
                  handleSearch(selectedKeys as string[], confirm, dataIndex, clearFilters ? clearFilters : null)
                }
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => handleReset(clearFilters ? clearFilters : null, confirm, dataIndex)}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  handleSearch(selectedKeys as string[], confirm, dataIndex, clearFilters ? clearFilters : null, {
                    closeDropdown: false,
                  });
                }}
              >
                Filter
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  close();
                }}
              >
                Close
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered: boolean) => <FilterOutlined />,
        onFilter: (value, record) =>
          getStringRep(record, dataIndex)
            .toLowerCase()
            .includes((value as string).toLowerCase()),
        filterDropdownProps: {
          onOpenChange(visible) {
            if (visible) {
              setTimeout(() => searchInput.current?.select(), 100);
            }
          },
        },
        render: (text) => {
          //console.log('in render, text=', text, objToString(text));
          return (
            <>
              {searchedColumn === dataIndex ? (
                <div style={{ backgroundColor: '#ffc069' }}>{text ? objToString(text) : ''}</div>
              ) : (
                objToString(text)
              )}
            </>
          );
        },
      };
    },
    [handleReset, handleSearch, searchText, searchedColumn]
  );

  return getColumnSearchProps;
}

export default useColumnSearchProps;
