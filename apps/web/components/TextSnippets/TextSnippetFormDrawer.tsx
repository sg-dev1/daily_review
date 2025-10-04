'use client';

import React, { useState } from 'react';
import { Button, Drawer, Form, Space } from 'antd';
import { TextSnippedDto } from '@repo/shared';
import TextSnippetForm from './TextSnippetForm';

interface TextSnippetFormDrawerProps {
  variant: 'create' | 'update';
  textSnippet?: TextSnippedDto;
}

const TextSnippetFormDrawer: React.FC<TextSnippetFormDrawerProps> = ({ variant, textSnippet }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const showDrawer = () => {
    setOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        {variant === 'update' ? 'Update Text Snippet' : 'Create Text Snippet'}
      </Button>
      <Drawer
        title={variant === 'update' ? 'Update Text Snippet' : 'Create Text Snippet'}
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
        <TextSnippetForm
          variant={variant}
          form={form}
          textSnippet={textSnippet}
          onHandleSubmit={() => {
            setOpen(false);
          }}
        />
      </Drawer>
    </>
  );
};

export default TextSnippetFormDrawer;
