export type requestStatus = "idle" | "pending" | "fulfilled" | "rejected";

export enum userRole {
  guest = "guest",
  regular = "regular",
  premium = "premium",
  admin = "admin",
}

export interface User {
  email: string;
  name: string;
  password: string;
  role: userRole;
  wins: number;
  games: number;
}

export type userState = {
  name: string | null;
  role: userRole;
  wins: number;
  token: string;
};
// export interface userState {
//   name: string | null;
//   role: userRole;
//   wins: number;
//   token: string;
// }

export interface HistoryGame {
  name: string;
  winner: string;
  loser: string;
  time: string;
}
export interface userStory {
  name: string;
  won: boolean;
  date: string;
}
