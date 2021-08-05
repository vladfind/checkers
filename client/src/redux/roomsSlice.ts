// import {
//   bindActionCreators,
//   createAsyncThunk,
//   createSlice,
//   PayloadAction,
// } from "@reduxjs/toolkit";
// import { backend } from "../comp/Online/onlinetypes";
// import { serverIP } from "../config";
// import { requestStatus } from "../User/usertypes";
// import Fuse from "fuse.js";

// interface startState {
//   fetchRoomsStatus: requestStatus;
//   rooms: backend.server[];
//   foundRooms: backend.server[];
// }
// const initialState: startState = {
//   fetchRoomsStatus: "idle",
//   rooms: [],
//   foundRooms: [],
// };

// export const fetchRooms = createAsyncThunk(
//   "rooms/fetchRooms",
//   async (query: string = "") => {
//     const URL = `${serverIP}/rooms`;
//     const res = await fetch(URL);
//     const rooms = (await res.json()) as backend.server[];
//     return { rooms, query };
//   }
// );

// export const deleteRoom = createAsyncThunk(
//   "rooms/deleteRoom",
//   async (id: string) => {
//     const URL = `${serverIP}/server/${id}`;
//     const res = await fetch(URL);
//     if (res.status === 200) {
//       return true;
//     }
//     return false;
//   }
// );

// export const roomsSlice = createSlice({
//   name: "rooms",
//   initialState,
//   reducers: {
//     searchRooms: (state, { payload }: PayloadAction<string>) => {
//       if (payload === "") {
//         state.foundRooms = state.rooms;
//       } else {
//         const fuse = new Fuse(state.rooms, { keys: ["name"] });
//         const res = fuse.search(payload);
//         const items = res.map((item) => item.item);
//         state.foundRooms = items;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(fetchRooms.pending, (state, action) => {
//       state.fetchRoomsStatus = action.meta.requestStatus;
//     });
//     builder.addCase(fetchRooms.fulfilled, (state, { payload, meta }) => {
//       state.rooms = payload.rooms;
//       state.fetchRoomsStatus = meta.requestStatus;

//       if (payload.query === "") {
//         state.foundRooms = payload.rooms;
//       } else {
//         const fuse = new Fuse(payload.rooms, { keys: ["name"] });
//         const res = fuse.search(payload.query);
//         const items = res.map((item) => item.item);
//         state.foundRooms = items;
//       }
//     });
//     builder.addCase(fetchRooms.rejected, (state, action) => {
//       if (!action.meta.aborted) {
//         state.fetchRoomsStatus = action.meta.requestStatus;
//       }
//     });
//   },
// });
// export const { searchRooms } = roomsSlice.actions;

export const x = 3;
