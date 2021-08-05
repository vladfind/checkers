import {
  cell as Cell,
  player as Player,
  move,
  attack,
} from "../Game/gametypes";
import { Logic } from "../Game/Logic";
type kid = [Cell[][], Player.white | Player.black, null | attack[]];
type action = move | attack;

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

export const getMoves = (
  grid: Cell[][],
  player: Player.white | Player.black
): Array<action> => {
  // let mixed: action[] = [];
  const moves: move[] = [];
  const attacks: attack[] = [];
  grid.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (Logic.get_player(col) === player) {
        const coLmoves = Logic.get_moves(grid, rowIndex, colIndex);
        const coLattacks = Logic.get_attacks(grid, rowIndex, colIndex);
        // mixed = mixed.concat(coLmoves);
        // mixed = mixed.concat(coLattacks);
        moves.push(...coLmoves);
        attacks.push(...coLattacks);
      }
    });
  });
  return [...attacks, ...moves];
};

export const getKid = (
  grid: Cell[][],
  player: Player.white | Player.black,
  action: action
): kid => {
  const nextGrid = Logic.copy(grid);
  if ("enemy_row" in action) {
    Logic.attack(
      nextGrid,
      action.start_row,
      action.start_col,
      action.enemy_row,
      action.enemy_col,
      action.end_row,
      action.end_col
    );
    const next_attacks = Logic.get_attacks(
      nextGrid,
      action.end_row,
      action.end_col
    );
    if (next_attacks.length === 0) {
      const next_player = Logic.get_other_player(player);
      return [nextGrid, next_player, null];
    }
    const next_player = player;
    return [nextGrid, next_player, next_attacks];
  }
  Logic.move(
    nextGrid,
    action.start_row,
    action.start_col,
    action.end_row,
    action.end_col
  );
  const next_player = Logic.get_other_player(player);
  return [nextGrid, next_player, null];
};

const getKids = (grid: Cell[][], player: Player.white | Player.black) => {
  const grids: Array<kid> = [];
  const actions = getMoves(grid, player);

  for (const action of actions) {
    grids.push(getKid(grid, player, action));
  }
  return grids;
};

export const getBestMove = (
  grid: Cell[][],
  depth: number,
  player: Player.white | Player.black,
  attacks: null | attack[]
) => {
  const actions = attacks || getMoves(grid, player);

  let bestMove: null | move | attack = null;

  let alpha = -Infinity;
  let beta = Infinity;
  if (player === Player.white) {
    let maxEval = -Infinity;
    for (const action of actions) {
      const [next_grid, next_player, next_attacks] = getKid(
        grid,
        player,
        action
      );
      const nextEval = minimax(
        next_grid,
        depth - 1,
        next_player,
        next_attacks,
        alpha,
        beta
      );
      if (nextEval > maxEval) {
        maxEval = nextEval;
        bestMove = action;
      }
      alpha = Math.max(alpha, nextEval);
      if (beta <= alpha) {
        break;
      }
    }
    return bestMove;
  }

  let minEval = Infinity;
  for (const action of actions) {
    const [next_grid, next_player, next_attacks] = getKid(grid, player, action);
    const nextEval = minimax(
      next_grid,
      depth - 1,
      next_player,
      next_attacks,
      alpha,
      beta
    );
    if (nextEval < minEval) {
      minEval = nextEval;
      bestMove = action;
    }
    beta = Math.min(beta, nextEval);
    if (beta <= alpha) {
      break;
    }
  }
  return bestMove;
};

//TODO make sure the case with no moves is properly handled
//I think now it prefers wins where the oponent does not have any moves left
//because no moves gives +/-Infinify, but real win at 0 depth only gives +/-10k
const minimax = (
  grid: Cell[][],
  depth: number,
  player: Player.white | Player.black,
  attacks: null | attack[],
  alpha: number,
  beta: number
) => {
  if (depth === 0) {
    return getVal(grid);
  }
  let kids = [] as kid[];
  if (attacks) {
    for (const attack of attacks) {
      kids.push(getKid(grid, player, attack));
    }
  } else {
    kids.push(...getKids(grid, player));
  }

  if (player === Player.white) {
    let maxEval = -Infinity;
    // if (kids.length === 0) this can be a possible fix
    // to the questions abose, still this need some more thought
    // {
    //   maxEval = getVal(grid)
    // }
    for (const [next_grid, next_player, next_attacks] of kids) {
      const nextEval = minimax(
        next_grid,
        depth - 1,
        next_player,
        next_attacks,
        alpha,
        beta
      );
      maxEval = Math.max(maxEval, nextEval);
      alpha = Math.max(alpha, nextEval);
      if (beta <= alpha) {
        break;
      }
    }
    return maxEval;
  }

  let minEval = Infinity;
  for (const [next_grid, next_player, next_attacks] of kids) {
    const nextEval = minimax(
      next_grid,
      depth - 1,
      next_player,
      next_attacks,
      alpha,
      beta
    );
    minEval = Math.min(minEval, nextEval);
    if (beta <= alpha) {
      break;
    }
  }
  return minEval;
};
