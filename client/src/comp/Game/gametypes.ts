import { start } from "repl";

export interface move {
  start_row: number;
  start_col: number;
  end_row: number;
  end_col: number;
}
export interface attack {
  start_row: number;
  start_col: number;
  enemy_row: number;
  enemy_col: number;
  end_row: number;
  end_col: number;
}
export enum cell {
  empty,
  white_regular,
  white_queen,
  black_regular,
  black_queen,
}

export enum player {
  none,
  white,
  black,
  spectator,
}

export interface gameState {
  me: player.white | player.black | player.spectator;
  current_player: player.white | player.black;
  check: null | { row: number; col: number };
  locked: boolean;
  moves: Array<move>;
  attacks: Array<attack>;
  grid: cell[][];
  winner: null | player.white | player.black;
}
export const startState: gameState = {
  winner: null,
  me: player.white,
  current_player: player.white,
  check: null,
  locked: false,
  moves: [],
  attacks: [],
  grid: [
    [0, 3, 0, 3, 0, 3, 0, 3],
    [3, 0, 3, 0, 3, 0, 3, 0],
    [0, 3, 0, 3, 0, 3, 0, 3],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
  ],
};
export interface onlineGameState extends gameState {
  waiting: boolean;
}

export const onlineStartState: onlineGameState = {
  ...startState,
  me: player.spectator,
  waiting: true,
};

export interface serverState {
  current_player: player.white | player.black;
  locked: false | { row: number; col: number };
  grid: cell[][];
}
export const startServerState: serverState = {
  current_player: player.white,
  locked: false,
  grid: [
    [0, 3, 0, 3, 0, 3, 0, 3],
    [3, 0, 3, 0, 3, 0, 3, 0],
    [0, 3, 0, 3, 0, 3, 0, 3],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
  ],
};
//debug stuff
if (false) {
  startState.grid = [
    [0, 0, 0, 2, 0, 3, 0, 3],
    [0, 0, 0, 0, 3, 0, 3, 0],
    [0, 0, 0, 1, 0, 0, 0, 3],
    [3, 0, 3, 0, 3, 0, 3, 0],
    [0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 1, 0],
  ];
}
if (false) {
  startState.current_player = player.black;
  startState.grid = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 4, 0, 0, 0, 0, 0],
  ];
}
if (false) {
  startState.current_player = player.black;
  startState.grid = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
}

if (false) {
  startState.current_player = player.black;
  startState.grid = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 0, 0, 0, 3, 0],
    [0, 3, 0, 3, 0, 3, 0, 3],
    [0, 0, 0, 0, 4, 0, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 3],
    [0, 0, 4, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
}
if (false) {
  startState.grid = [
    [0, 3, 0, 3, 0, 3, 0, 3],
    [3, 0, 3, 0, 0, 0, 3, 0],
    [0, 0, 0, 3, 0, 3, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
  ];
  startState.current_player = player.black;
}
if (false) {
  startState.grid = [
    [0, 3, 0, 0, 0, 0, 0, 0],
    [3, 0, 3, 0, 3, 0, 3, 0],
    [0, 0, 0, 3, 0, 3, 0, 3],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
}
