import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { API } from "./API";
import { botslice } from "./botslice";
import { saveState } from "./localStore";
import counterReducer from "./slice";
import { userslice } from "./userslice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    bot: botslice.reducer,
    user: userslice.reducer,
    [API.reducerPath]: API.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(API.middleware);
  },
});

setupListeners(store.dispatch);

store.subscribe(() => {
  const state = store.getState();
  const nextState = {
    user: { token: state.user.token },
    bot: state.bot,
  };

  saveState(nextState);
});

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useAppStore: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppBotStore = () => useAppStore((state) => state.bot);
export const useUser = () => useAppStore((state) => state.user);
