'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../app/store';
import { App, Button, Drawer, Form, Input, Space } from 'antd';
import { createTextSnippet, getTextSnippets, updateTextSnippet } from '../../app/slices/textSnippetSlice';
import { TextSnippedDto } from '@repo/shared';

const { TextArea } = Input;

interface TextSnippetFormProps {
  variant: 'create' | 'update';
  textSnippet?: TextSnippedDto;
}

const TextSnippetForm: React.FC<TextSnippetFormProps> = ({ variant, textSnippet }) => {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      let action;
      switch (variant) {
        case 'create':
          action = await dispatch(
            createTextSnippet({
              text: values.text,
              bookTitle: values.bookTitle,
              bookAuthor: values.bookAuthor,
              note: values.note || '',
              location: values.location || '',
            })
          );
          break;
        case 'update':
          action =
            textSnippet &&
            (await dispatch(
              updateTextSnippet({
                id: textSnippet.id,

                text: values.text,
                bookTitle: values.bookTitle,
                bookAuthor: values.bookAuthor,
                note: values.note,
                location: values.location,
              })
            ));
          break;
      }

      if (action && (updateTextSnippet.fulfilled.match(action) || createTextSnippet.fulfilled.match(action))) {
        // Fetch the updated list here
        dispatch(getTextSnippets());
        form.resetFields();
        setOpen(false);
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
      text: textSnippet?.text ?? '',
      bookTitle: textSnippet?.bookTitle ?? '',
      bookAuthor: textSnippet?.bookAuthor ?? '',
      note: textSnippet?.note ?? '',
      location: textSnippet?.location ?? '',
    });
  }, [textSnippet, form]);

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
        <Form
          form={form}
          layout="vertical"
          name={variant === 'update' ? `form-text-snippet-update-${textSnippet?.id}` : 'form-text-snippet-create'}
          onFinish={handleSubmit}
          onKeyDown={handleKeyDown}
        >
          <Form.Item
            name="bookTitle"
            label={'Title'}
            rules={[{ required: true, message: 'Set the title of the book' }]}
          >
            <Input placeholder={'Some Title'} />
          </Form.Item>

          <Form.Item
            name="bookAuthor"
            label={'Author'}
            rules={[{ required: true, message: 'Set the author of the book' }]}
          >
            <Input placeholder={'Some Author, Some Second Author, and Some Third Author'} />
          </Form.Item>

          <Form.Item
            name="location"
            label={'Location (Page #)'}
            rules={[{ required: false, message: 'Set the location of the text snippet' }]}
          >
            <Input placeholder={'12'} />
          </Form.Item>

          <Form.Item
            name="text"
            label={'Text'}
            rules={[{ required: true, message: 'Set the text of the text snippet' }]}
          >
            <TextArea
              autoSize={{ minRows: 5 }}
              placeholder={'Text of this text snippet ...'}
              //maxLength={250}
            />
          </Form.Item>

          <Form.Item
            name="note"
            label={'Note'}
            rules={[{ required: false, message: 'Add a note to the text snippet' }]}
          >
            <TextArea
              autoSize={{ minRows: 3 }}
              placeholder={'My notes ...'}
              //maxLength={250}
            />
          </Form.Item>

          {/* <Form.Item
          name="numReviewItemsToSend"
          label={'Number of review items to send'}
          rules={[{ required: true, message: 'Set the number of review items that will be sent with each review.' }]}
        >
          <InputNumber placeholder={'Number of review items to send'} min={1} max={100} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="reviewFreqAndTime"
          label={'Review frequency as cron string'}
          rules={[{ required: true, message: 'Set the review frequency as cron string' }]}
        >
          <Input placeholder={'0 0 8 * * *'} />
        </Form.Item>

        <Form.Item
          name="filterReviewSelectionStrategyType"
          label={'Review selection strategy'}
          rules={[{ required: true, message: 'Select a review selection strategy' }]}
        >
          <Select>
            <Option value={'author'}>{'author'}</Option>
            <Option value={'title'}>{'title'}</Option>
            <Option value={'both'}>{'both'}</Option>
          </Select>
        </Form.Item>         */}
        </Form>
      </Drawer>
    </>
  );
};

export default TextSnippetForm;
