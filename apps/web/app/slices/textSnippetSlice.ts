import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiEndpoint from './api';
import axios from 'axios';
import { CreateTextSnippetDtoType, TextSnippedDto, UpdateTextSnippetDtoType } from '@repo/shared';
import { showErrorMessage } from './showErrorMessage';

// Define a type for the slice state
export interface TextSnippetSliceState {
  loading: boolean;
  error: unknown;
  textSnippetsList: TextSnippedDto[];
}

const initialState: TextSnippetSliceState = {
  loading: false,
  error: null,
  textSnippetsList: [],
};

// ---

export const getTextSnippets = createAsyncThunk<any, void>('text-snippet/list', async (_, { rejectWithValue }) => {
  const requestUrl = ApiEndpoint.getTextSnippetsPath() + '/list';
  const payload = ApiEndpoint.makeApiPayload(requestUrl, 'GET', true, {});
  try {
    const response = await axios(payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.message);
  }
});

export const createTextSnippet = createAsyncThunk<any, CreateTextSnippetDtoType, {}>(
  'text-snippet/create',
  async (registerCredentials, { rejectWithValue }) => {
    const requestUrl = ApiEndpoint.getTextSnippetsPath();
    const payload = ApiEndpoint.makeApiPayload(requestUrl, 'POST', registerCredentials);
    try {
      await axios(payload);
      return payload;
    } catch (error: any) {
      return rejectWithValue(error.response.message);
    }
  }
);

export const updateTextSnippet = createAsyncThunk<any, UpdateTextSnippetDtoType>(
  'text-snippet/update',
  async (userDtoWithId, { rejectWithValue }) => {
    const { id, ...userDto } = userDtoWithId;
    const requestUrl = ApiEndpoint.getTextSnippetsPath() + '/' + id;
    const payload = ApiEndpoint.makeApiPayload(requestUrl, 'PATCH', userDto);
    try {
      const response = await axios(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.message);
    }
  }
);

export const deleteTextSnippet = createAsyncThunk<any, number>(
  'text-snippet/delete',
  async (id, { rejectWithValue }) => {
    const requestUrl = ApiEndpoint.getTextSnippetsPath() + '/' + id;
    const payload = ApiEndpoint.makeApiPayload(requestUrl, 'DELETE');
    try {
      const response = await axios(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.message);
    }
  }
);

// ---

// Note: Inplace updates like this currently do not work as expected.
// Reason is the filtering logic in TextSnippetList.
const updateTextSnippetList = (state: TextSnippetSliceState, action: { payload: TextSnippedDto }) => {
  const indexInList = state.textSnippetsList.findIndex((textSnippet) => textSnippet.id === action.payload.id);
  if (indexInList !== -1) {
    state.textSnippetsList[indexInList] = action.payload;
  } else {
    state.textSnippetsList.push(action.payload);
  }
};

export const textSnippetSlice = createSlice({
  name: 'text-snippet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTextSnippets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTextSnippets.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.textSnippetsList = action.payload.data;
      })
      .addCase(getTextSnippets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showErrorMessage(state);
      })
      .addCase(createTextSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTextSnippet.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        //authSlice.caseReducers.showSuccessMessage();
        //updateTextSnippetList(state, action);
      })
      .addCase(createTextSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showErrorMessage(state);
      })
      .addCase(updateTextSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTextSnippet.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        //updateTextSnippetList(state, action);
      })
      .addCase(updateTextSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showErrorMessage(state);
      })
      .addCase(deleteTextSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTextSnippet.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteTextSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showErrorMessage(state);
      });
  },
});
