'use client';

import { App, Button, Form, Input, InputNumber, Select } from 'antd';
import React from 'react';
import { useAppDispatch } from '../../app/store';
import { updateUser } from '../../app/slices/userSlice';
import { getUser } from '../../app/slices/authSlice';
import { UserDto } from '@repo/shared';

const { Option } = Select;

interface ReviewSettingsProps {
  user: UserDto | null;
}

const ReviewSettings: React.FC<ReviewSettingsProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    if (user === null) {
      return;
    }

    try {
      const action = await dispatch(
        updateUser({
          id: user.id,

          numReviewItemsToSend: values.numReviewItemsToSend || 5,
          reviewFreqAndTime: values.reviewFreqAndTime || '0 0 8 * * *',
          filterReviewSelectionStrategyType: values.filterReviewSelectionStrategyType,

          filterReviewStrategyAuthor: values.filterReviewStrategyAuthor,
          filterReviewStrategyTitle: values.filterReviewStrategyTitle,
        })
      );

      if (action && updateUser.fulfilled.match(action)) {
        // Fetch the updated list here
        dispatch(getUser());
        form.resetFields();
      }
    } catch (error: any) {
      message.error(error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      form.submit();
    }
  };

  if (user === null) {
    return (
      <div>
        <p>Logged in user is null. This likely is an error accessing this component.</p>
      </div>
    );
  } else {
    return (
      <>
        <Form
          form={form}
          layout="vertical"
          name={'form-edit-review-settings'}
          className="login-form"
          onFinish={handleSubmit}
          onKeyDown={handleKeyDown}
          initialValues={{
            numReviewItemsToSend: user.numReviewItemsToSend,
            reviewFreqAndTime: user.reviewFreqAndTime,
            filterReviewSelectionStrategyType: user.filterReviewSelectionStrategyType,
            filterReviewStrategyAuthor: user.filterReviewStrategyAuthor,
            filterReviewStrategyTitle: user.filterReviewStrategyTitle,
          }}
        >
          <Form.Item
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
              {/* {FilterReviewSelectionStrategyTypeItems.map((item) => {
              return (
                <Option key={item} value={item}>
                  {item}
                </Option>
              );
            })} */}
              <Option value={'author'}>{'author'}</Option>
              <Option value={'title'}>{'title'}</Option>
              <Option value={'both'}>{'both'}</Option>
            </Select>
          </Form.Item>

          {(user.filterReviewSelectionStrategyType === 'author' ||
            user.filterReviewSelectionStrategyType === 'both') && (
            <Form.Item
              name="filterReviewStrategyAuthor"
              label={'Author for review filter'}
              rules={[{ required: true, message: 'Set the author for review filter' }]}
            >
              <Input />
            </Form.Item>
          )}

          {(user.filterReviewSelectionStrategyType === 'title' ||
            user.filterReviewSelectionStrategyType === 'both') && (
            <Form.Item
              name="filterReviewStrategyTitle"
              label={'Title for review filter'}
              rules={[{ required: true, message: 'Set the title for review filter' }]}
            >
              <Input />
            </Form.Item>
          )}
        </Form>
        <Button
          onClick={() => {
            form.submit();
          }}
          style={{ marginRight: '16px' }}
          type="primary"
        >
          Submit
        </Button>
      </>
    );
  }
};

export default ReviewSettings;
