import { createSlice } from "@reduxjs/toolkit";
import { userState, userRole } from "../User/usertypes";
import { API } from "./API";

const initialState: userState = {
  name: null,
  role: userRole.guest,
  wins: 0,
  token: "",
};

export const userslice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(API.endpoints.login.matchFulfilled, (state, action) => {
      const { name, role, wins, token } = action.payload;
      state.name = name;
      state.role = role;
      state.wins = wins;
      state.token = token;
    });
    builder.addMatcher(
      API.endpoints.LocalLogin.matchFulfilled,
      (state, action) => {
        const { name, role, wins, token } = action.payload;
        state.name = name;
        state.role = role;
        state.wins = wins;
        state.token = token;
      }
    );
  },
});

export const { logout } = userslice.actions;
