import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/features/auth/store/auth-slice';
import userReducer from '@/features/users/store/user-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
