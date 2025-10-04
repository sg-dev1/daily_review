'use client';

import React, { useEffect, useState } from 'react';
import { Nav } from './Layout/Nav';
import { useAppDispatch, useAppSelector } from '../app/store';
import { selectAuth } from '../app/slices/authSlice';
import { deleteTextSnippet, getTextSnippets } from '../app/slices/textSnippetSlice';
import TextSnippetList from './TextSnippets/TextSnippetList';
import TextSnippetFormDrawer from './TextSnippets/TextSnippetFormDrawer';
import { Button, Flex, Form, Layout } from 'antd';
import { TextSnippedDto } from '@repo/shared';
import TextSnippetForm from './TextSnippets/TextSnippetForm';
import ButtonWithConfirm from './Utils/ButtonWithConfirm';

const { Content, Sider } = Layout;

const MainPage = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectAuth);

  const [selectedRowData, setSelectedRowData] = useState<TextSnippedDto | null>(null);
  const [form] = Form.useForm();

  const siderVisible = selectedRowData !== null;

  useEffect(() => {
    dispatch(getTextSnippets());
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      {isAuthenticated && (
        <Layout>
          <div style={{ backgroundColor: '#F2F2F2', flex: '1', padding: '32px' }}>
            <h1 style={{ marginBottom: '32px' }}>Text Snippets</h1>
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}
            >
              <TextSnippetFormDrawer variant="create" />
            </div>
            <Layout>
              <Content style={{ padding: '0px 0px 24px', marginRight: siderVisible ? 500 : 0 }}>
                <TextSnippetList selectedRowData={selectedRowData} setSelectedRowData={setSelectedRowData} />
              </Content>
              {selectedRowData && (
                <Sider
                  width={siderVisible ? 500 : 0}
                  style={{
                    overflow: 'auto',
                    //height: '100vh',
                    position: 'fixed',
                    right: 0,
                    top: 64,
                    bottom: 0,
                    backgroundColor: 'white',
                    padding: '10px 10px 10px 10px',
                  }}
                >
                  <Flex
                    gap="small"
                    style={{ alignItems: 'center', flexGrow: 1, marginBottom: 24 }}
                    justify="space-between"
                  >
                    <Button
                      type="link"
                      onClick={() => {
                        setSelectedRowData(null);
                      }}
                    >
                      Hide
                    </Button>

                    <Flex gap="small" style={{ alignItems: 'right', flexGrow: 1 }} justify="flex-end">
                      <Button
                        onClick={() => {
                          form.submit();
                          setSelectedRowData(null);
                        }}
                        type="primary"
                      >
                        Save
                      </Button>

                      <ButtonWithConfirm
                        handleOk={async () => {
                          await dispatch(deleteTextSnippet(selectedRowData.id));
                          dispatch(getTextSnippets());
                          setSelectedRowData(null);
                        }}
                        handleCancle={() => {}}
                        title={'Delete'}
                        description={`Do you want to delete the text snippet from '${selectedRowData.bookTitle} by ${selectedRowData.bookAuthor}'`}
                        danger
                        type={'primary'}
                      >
                        Delete
                      </ButtonWithConfirm>
                    </Flex>
                  </Flex>

                  <TextSnippetForm variant="update" form={form} textSnippet={selectedRowData} />
                </Sider>
              )}
            </Layout>
          </div>
        </Layout>
      )}
    </div>
  );
};

export default MainPage;
