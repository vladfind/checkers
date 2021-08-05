import { stat } from "fs";
import {
  attack,
  cell,
  gameState,
  move,
  player,
  startState,
} from "../Game/gametypes";
import { Logic } from "../Game/Logic";

export type actionOffline =
  | { type: "setCheck"; check: null | { row: number; col: number } }
  | { type: "move"; end_row: number; end_col: number }
  | {
      type: "attack";
      enemy_row: number;
      enemy_col: number;
      end_row: number;
      end_col: number;
    }
  | { type: "setCurrentPlayer"; player: player.white | player.black }
  | { type: "setMe"; me: player.white | player.black | player.spectator }
  // | { type: "setGrid"; grid: cell[][] }
  | { type: "restart" }
  | { type: "botMove"; move: move }
  | { type: "botAttack"; attack: attack };

export const ReducerOffline = (
  state: gameState,
  action: actionOffline
): gameState => {
  switch (action.type) {
    case "setCurrentPlayer": {
      return { ...state, current_player: action.player };
    }
    case "setCheck": {
      if (action.check === null) {
        return { ...state, check: null, moves: [], attacks: [] };
      }
      const { row, col } = action.check;

      const moves = Logic.get_moves(state.grid, row, col);
      const attacks = Logic.get_attacks(state.grid, row, col);
      return { ...state, check: action.check, moves, attacks };
    }
    case "move": {
      if (!state.check) {
        return { ...state };
      }
      const { end_row, end_col } = action;
      const start_row = state.check.row;
      const start_col = state.check.col;
      const next_grid = Logic.copy(state.grid);
      Logic.move(next_grid, start_row, start_col, end_row, end_col);
      const next_player = Logic.get_other_player(state.current_player);

      if (Logic.check_win(state.current_player, next_grid)) {
        return { ...state, grid: next_grid, winner: state.current_player };
      }

      return {
        ...state,
        grid: next_grid,
        check: null,
        moves: [],
        attacks: [],
        current_player: next_player,
      };
    }
    case "attack": {
      if (!state.check) {
        return { ...state };
      }
      const next_grid = Logic.copy(state.grid);
      Logic.attack(
        next_grid,
        state.check.row,
        state.check.col,
        action.enemy_row,
        action.enemy_col,
        action.end_row,
        action.end_col
      );
      if (Logic.check_win(state.current_player, next_grid)) {
        return { ...state, grid: next_grid, winner: state.current_player };
      }

      const next_attacks = Logic.get_attacks(
        next_grid,
        action.end_row,
        action.end_col
      );

      if (next_attacks.length === 0) {
        const next_player = Logic.get_other_player(state.current_player);
        return {
          ...state,
          grid: next_grid,
          check: null,
          moves: [],
          attacks: [],
          locked: false,
          current_player: next_player,
        };
      }
      //lock player into attack mode (locked: true)
      return {
        ...state,
        grid: next_grid,
        check: { row: action.end_row, col: action.end_col },
        moves: [],
        attacks: next_attacks,
        locked: true,
      };
    }
    case "botMove": {
      const next_grid = Logic.copy(state.grid);
      const { start_row, start_col, end_row, end_col } = action.move;
      Logic.move(next_grid, start_row, start_col, end_row, end_col);
      if (Logic.check_win(state.current_player, next_grid)) {
        return { ...state, grid: next_grid, winner: state.current_player };
      }
      const next_player = Logic.get_other_player(state.current_player);
      return { ...state, grid: next_grid, current_player: next_player };
    }
    case "botAttack": {
      const next_grid = Logic.copy(state.grid);
      const { start_row, start_col, end_row, end_col, enemy_row, enemy_col } =
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
      if (Logic.check_win(state.current_player, next_grid)) {
        return { ...state, grid: next_grid, winner: state.current_player };
      }
      const next_attacks = Logic.get_attacks(next_grid, end_row, end_col);
      if (next_attacks.length === 0) {
        const next_player = Logic.get_other_player(state.current_player);
        return {
          ...state,
          grid: next_grid,
          locked: false,
          current_player: next_player,
          attacks: [],
        };
      }
      return { ...state, grid: next_grid, locked: true, attacks: next_attacks };
    }
    case "setMe": {
      return { ...state, me: action.me };
    }
    case "restart": {
      return { ...startState, me: state.me };
    }

    default: {
      console.log("HELP");
      console.log(action);
      throw new Error("Problem with unkown action");
    }
  }
};
