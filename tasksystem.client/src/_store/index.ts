import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from './auth.slice';
import { taskReducer } from "./task.slice";
import { userReducer } from "./user.slice";

export * from './auth.slice';
export * from './task.slice';
export * from './user.slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        task: taskReducer,
        user: userReducer
    },
});