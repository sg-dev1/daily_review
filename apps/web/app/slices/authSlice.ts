import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import UserType from '../types/UserType';
import { message } from 'antd';
import ApiEndpoint from './api';
import axios from 'axios';
import LoginDtoType from '../types/LoginDtoType';
import { showErrorMessage } from './showErrorMessage';
import { RootState } from '../store';

interface AuthSliceState {
  isAuthenticated: boolean;
  loading: boolean;
  error: unknown;
  user: UserType | null;
}

const initialState: AuthSliceState = {
  isAuthenticated: false,
  loading: true,
  error: null,
  user: null,
};

// ---

export const loginUser = createAsyncThunk<any, LoginDtoType, {}>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    const requestUrl = ApiEndpoint.getLoginPath();
    const payload = ApiEndpoint.makeApiPayload(requestUrl, 'POST', credentials);
    try {
      await axios(payload);
      return payload;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const logoutUser = createAsyncThunk<any, void>('auth/logout', async (_, { rejectWithValue }) => {
//   const requestUrl = ApiEndpoint.getLogoutPath();
//   const payload = ApiEndpoint.makeApiPayload(requestUrl, 'GET');
//   try {
//     await axios(payload);
//     return payload;
//   } catch (error: any) {
//     return rejectWithValue(error.response.data);
//   }
// });

export const getUser = createAsyncThunk<any, void>('auth/getProfile', async (_, { rejectWithValue }) => {
  const requestUrl = ApiEndpoint.getProfilePath();
  const payload = ApiEndpoint.makeApiPayload(requestUrl, 'GET');
  try {
    const response = await axios(payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

// ---

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // clearErrorMessage: (state) => {
    //   state.error = null;
    // },
    // showSuccessMessage: () => {
    //   message.success('Login successful');
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        //authSlice.caseReducers.showSuccessMessage();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showErrorMessage(state);
      })
      // .addCase(logoutUser.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(logoutUser.fulfilled, (state) => {
      //   state.isAuthenticated = false;
      //   state.loading = false;
      //   state.error = null;
      // })
      // .addCase(logoutUser.rejected, (state, action) => {
      //   state.isAuthenticated = false;
      //   state.loading = false;
      //   state.error = action.payload;
      // })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      });
  },
});

//export const { clearErrorMessage, showSuccessMessage } = authSlice.actions;

export const selectAuth = (state: RootState): boolean => state?.auth?.isAuthenticated || false;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectErrorMessage = (state: RootState) => state.auth.error;
export const selectUser = (state: RootState): UserType | null => state?.auth?.user || null;
