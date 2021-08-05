import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { player } from "../comp/Game/gametypes";
import { loadState } from "./localStore";

export interface botState {
  me: player.white | player.black;
  level: 1 | 2 | 3 | 4 | 5;
}
const initialState: botState = {
  me: player.white,
  level: 1,
};

const oldState = loadState();
if (oldState) {
  const { bot } = oldState;
  initialState.level = bot.level;
  initialState.me = bot.me;
}
export const botslice = createSlice({
  name: "bot",
  initialState,
  reducers: {
    setMe: (state, action: PayloadAction<player.white | player.black>) => {
      state.me = action.payload;
    },
    setLevel: (state, action: PayloadAction<1 | 2 | 3 | 4 | 5>) => {
      state.level = action.payload;
    },
  },
});

export const { setMe, setLevel } = botslice.actions;
