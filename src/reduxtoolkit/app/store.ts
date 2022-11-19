import { configureStore } from "@reduxjs/toolkit";

import userSlice from "../features/user/userSlice";
import meetSlice from  '../features/meet/meetSlice'

export const store = configureStore({
  reducer:{
    user:userSlice,
    meet:meetSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {
      serializableCheck:false,
      // serializableCheck: {
      //   // Ignore these action types
      //   ignoredActions: ['userSlice/setMainStream'],
      //   // Ignore these field paths in all actions
      //   // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
      //   // Ignore these paths in the state
      //   // ignoredPaths: ['items.dates'],
      // },
    }
  ),
})

export type RootState = ReturnType<typeof store.getState>;


export type AppDispatch = typeof store.dispatch;