import { FetchBaseQueryMeta } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { backend } from "../comp/Online/onlinetypes";
import { serverIP } from "../config";
import { userStory } from "../User/usertypes";
import {
  MyError,
  LoginAPI,
  LocalLoginAPI,
  RegisterAPI,
  StoryAPI,
} from "./APItypes";
import { RootState } from "./store";

interface myErr {
  status: number;
  data: MyError;
}

const myBase = fetchBaseQuery({
  baseUrl: serverIP,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
}) as BaseQueryFn<string | FetchArgs, unknown, myErr, {}, FetchBaseQueryMeta>;

export const API = createApi({
  reducerPath: "API",
  baseQuery: myBase,
  endpoints: (buider) => ({
    getRooms: buider.query<backend.server[], void>({
      query: () => "/rooms/public",
    }),
    getRatingRooms: buider.query<backend.rating[], void>({
      query: () => "/rooms/rating",
    }),
    getHistory: buider.query<StoryAPI.response, void>({
      query: () => `/user/history`,
    }),
    test: buider.query<{ text: string }, void>({
      query: () => ({ url: "" }),
    }),
    login: buider.mutation<LoginAPI.response, LoginAPI.request>({
      query: (req) => ({
        method: "POST",
        url: "/user/login",
        body: req,
      }),
    }),
    LocalLogin: buider.mutation<
      LoginAPI.response,
      LocalLoginAPI.request | null
    >({
      query: (req) => ({
        method: "POST",
        url: "/user/locallogin",
        body: req,
      }),
    }),
    register: buider.mutation<RegisterAPI.response, RegisterAPI.request>({
      query: (req) => ({
        method: "POST",
        url: "/user/register",
        body: req,
      }),
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRatingRoomsQuery,
  useGetHistoryQuery,
  useTestQuery,
  useLoginMutation,
  useLocalLoginMutation,
  useRegisterMutation,
} = API;
