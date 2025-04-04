/** This library contains the setup logic for the redux store. */
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userSlice } from './slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { authSlice } from './slices/authSlice';

const reducer = combineReducers({
  users: userSlice.reducer,
  auth: authSlice.reducer,
});

// The any was needed as a workaround for a strange TypeScript compile error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const store: any = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['files/download/fulfilled', 'serverCheck/getServerCheckReport/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: [], //['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: [], //['items.dates'],
      },
    }); //.concat(middleware);
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
