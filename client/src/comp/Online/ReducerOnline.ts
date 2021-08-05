import { cell, move, onlineGameState, player } from "../Game/gametypes";
import { attack } from "../Bot/types";
import { Logic } from "../Game/Logic";

export type actionOnline =
  | { type: "setCheck"; check: null | { row: number; col: number } }
  | { type: "setGrid"; grid: cell[][] }
  | { type: "setCurrentPlayer"; player: player.white | player.black }
  | { type: "setMe"; me: player.white | player.black | player.spectator }
  | { type: "onlineMove"; move: move }
  | { type: "onlineAttack"; attack: attack }
  | { type: "setLocked"; check: null | { row: number; col: number } }
  | { type: "setWaiting"; waiting: boolean };

export const ReducerOnline = (
  state: onlineGameState,
  action: actionOnline
): onlineGameState => {
  switch (action.type) {
    case "setCheck": {
      if (action.check === null) {
        return { ...state, check: null, moves: [], attacks: [] };
      }
      const { row, col } = action.check;

      const moves = Logic.get_moves(state.grid, row, col);
      const attacks = Logic.get_attacks(state.grid, row, col);
      return { ...state, check: action.check, moves, attacks };
    }
    case "setGrid":
      return { ...state, grid: action.grid };
    case "setCurrentPlayer":
      return { ...state, current_player: action.player };
    case "setMe":
      return { ...state, me: action.me };
    case "onlineMove": {
      const next_grid = Logic.copy(state.grid);
      const { start_row, start_col, end_row, end_col } = action.move;
      Logic.move(next_grid, start_row, start_col, end_row, end_col);
      return { ...state, grid: next_grid, check: null, moves: [], attacks: [] };
    }
    case "onlineAttack": {
      const next_grid = Logic.copy(state.grid);
      const { start_row, start_col, enemy_row, enemy_col, end_row, end_col } =
        action.attack;
      Logic.attack(
        next_grid,
        start_row,
        start_col,
        enemy_row,
        enemy_col,
        end_row,
        end_col
      );
      return { ...state, grid: next_grid, check: null, moves: [], attacks: [] };
    }
    case "setLocked": {
      const { check } = action;
      if (state.current_player !== state.me) {
        return { ...state };
      }
      if (check) {
        const attacks = Logic.get_attacks(state.grid, check.row, check.col);
        return { ...state, check, locked: true, moves: [], attacks };
      } else {
        return { ...state, check, locked: false, moves: [], attacks: [] };
      }
    }
    case "setWaiting":
      return { ...state, waiting: action.waiting };
    default: {
      console.log("HELP");
      throw new Error("Problem with unkown action");
    }
  }
};
