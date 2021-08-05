import {
  attack,
  cell as Cell,
  move,
  player as Player,
} from "../Game/gametypes";
import { Logic } from "../Game/Logic";
import { getMoves } from "./getMove";

const getVal = (grid: Cell[][]) => {
  if (Logic.check_win(Player.white, grid)) {
    console.log("WIN WHITE");
    return 10000;
  } else if (Logic.check_win(Player.black, grid)) {
    console.log("WIN BLACK");
    return -10000;
  }
  let whites = 0;
  let blacks = 0;
  let whiteKings = 0;
  let blackKings = 0;
  for (const row of grid) {
    for (const col of row) {
      if (col === Cell.empty) {
        continue;
      }
      if (Logic.get_player(col) === Player.white) {
        whites++;
        if (Logic.is_queen(col)) {
          whiteKings++;
        }
      } else {
        blacks++;
        if (Logic.is_queen(col)) {
          blackKings++;
        }
      }
    }
  }

  const val = whites - blacks + whiteKings * 10 - blackKings * 10;
  return val;
};

//white - max, black - min
export const get_other_player = (player: Player.white | Player.black) =>
  player === Player.white ? Player.black : Player.white;

const getNextEval = (
  grid: Cell[][],
  depth: number,
  player: Player.white | Player.black,
  move: move | attack,
  alpha: number,
  beta: number
) => {
  const next_grid = Logic.copy(grid);
  if ((move as attack).enemy_row) {
    const attack = move as attack;
    Logic.attack(
      next_grid,
      attack.start_row,
      attack.start_col,
      attack.enemy_row,
      attack.enemy_col,
      attack.end_row,
      attack.end_col
    );

    const next_attacks = Logic.get_attacks(
      next_grid,
      attack.end_row,
      attack.end_col
    );

    return next_attacks.length === 0
      ? minimax(
          next_grid,
          depth - 1,
          Logic.get_other_player(player),
          alpha,
          beta
        )
      : minimax(next_grid, depth - 1, player, alpha, beta, next_attacks);
  }

  Logic.move(
    next_grid,
    move.start_row,
    move.start_col,
    move.end_row,
    move.end_col
  );

  return minimax(
    next_grid,
    depth - 1,
    Logic.get_other_player(player),
    alpha,
    beta
  );
};

export const getBestMove = (
  grid: Cell[][],
  depth: number,
  player: Player.white | Player.black,
  attacks: attack[] = []
) => {
  let alpha = -Infinity;
  let beta = Infinity;

  let bestMove = null;
  const moves = attacks.length === 0 ? getMoves(grid, player) : attacks;
  if (player === Player.white) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const nextEval = getNextEval(grid, depth, player, move, alpha, beta);
      if (nextEval > maxEval) {
        maxEval = nextEval;
        bestMove = move;
      }
      alpha = Math.max(alpha, nextEval);
      if (beta <= alpha) {
        break;
      }
    }
    return bestMove;
  }

  //player is black
  let minEval = Infinity;
  for (const move of moves) {
    const nextEval = getNextEval(grid, depth, player, move, alpha, beta);
    if (nextEval < minEval) {
      minEval = nextEval;
      bestMove = move;
    }
    beta = Math.min(beta, nextEval);
    if (beta <= alpha) {
      break;
    }
  }
  return bestMove;
};

function minimax(
  grid: Cell[][],
  depth: number,
  player: Player.white | Player.black,
  alpha: number,
  beta: number,
  attacks: attack[] = []
): number {
  if (depth === 0) {
    return getVal(grid);
  }

  const moves = attacks.length === 0 ? getMoves(grid, player) : attacks;
  // if (moves.length === 0) {
  // this was the difference between 2 (this one) and 3(the new one)
  // return getVal(grid);
  // }
  if (player === Player.white) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const nextEval = getNextEval(grid, depth, player, move, alpha, beta);
      if (nextEval > maxEval) {
        maxEval = nextEval;
      }
    }
    return maxEval;
  }

  //black player
  let minEval = Infinity;
  for (const move of moves) {
    const nextEval = getNextEval(grid, depth, player, move, alpha, beta);
    if (nextEval < minEval) {
      minEval = nextEval;
    }
  }
  return minEval;
}
