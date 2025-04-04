import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiEndpoint from './api';
import axios from 'axios';
import { showErrorMessage } from './showErrorMessage';
import UserType from '../types/UserType';

// Define a type for the slice state
export interface UserSliceState {
  loading: boolean;
  error: unknown;
  userList: UserType[];
}

const initialState: UserSliceState = {
  loading: false,
  error: null,
  userList: [],
};

// ---

export const getUsers = createAsyncThunk<any, void>('user/getUsers', async (_, { rejectWithValue }) => {
  const requestUrl = ApiEndpoint.getUsersPath();
  const payload = ApiEndpoint.makeApiPayload(requestUrl, 'GET', true, {});
  try {
    const response = await axios(payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const createUser = createAsyncThunk<any, UserType, {}>(
  'user/createUser',
  async (registerCredentials, { rejectWithValue }) => {
    const requestUrl = ApiEndpoint.getUsersPath();
    const payload = ApiEndpoint.makeApiPayload(requestUrl, 'POST', registerCredentials);
    try {
      await axios(payload);
      return payload;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateUser = createAsyncThunk<any, UserType>('user/updateUser', async (userDto, { rejectWithValue }) => {
  const requestUrl = ApiEndpoint.getUsersPath() + '/' + userDto.id;
  const payload = ApiEndpoint.makeApiPayload(requestUrl, 'PUT', userDto);
  try {
    const response = await axios(payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const deleteUser = createAsyncThunk<any, number>('user/deleteUser', async (userId, { rejectWithValue }) => {
  const requestUrl = ApiEndpoint.getUsersPath() + '/' + userId;
  const payload = ApiEndpoint.makeApiPayload(requestUrl, 'DELETE');
  try {
    const response = await axios(payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

// ---

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userList = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showErrorMessage(state);
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        //authSlice.caseReducers.showSuccessMessage();
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showErrorMessage(state);
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showErrorMessage(state);
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showErrorMessage(state);
      });
  },
});
