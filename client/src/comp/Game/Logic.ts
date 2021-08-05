import { attack, cell as Cell, move, player as Player } from "./gametypes";

/**
 *
 * @param value
 * @param end
 * @param start
 * @returns check if value in [start, end)
 */
const checkBounds = (value: number, end: number, start: number = 0) =>
  value >= start && value < end;

const checkBoundsArray = (values: number[], end: number, start: number = 0) => {
  for (let i = 0; i < values.length; i++) {
    if (!checkBounds(values[i], end, start)) {
      return false;
    }
  }
  return true;
};
export const Logic = {
  checkBoundsArray: checkBoundsArray,
  is_queen(cell: Cell) {
    if (cell === Cell.white_queen || cell === Cell.black_queen) {
      return true;
    }
    return false;
  },
  get_player(cell: Cell) {
    if (cell === Cell.empty) {
      return Player.none;
    }
    if (cell === Cell.white_regular || cell === Cell.white_queen) {
      return Player.white;
    }
    if (cell === Cell.black_regular || cell === Cell.black_queen) {
      return Player.black;
    }
    throw new Error("Unknown cell type");
  },
  should_be_queen(grid: Cell[][], row: number, col: number) {
    const cell = grid[row][col];
    if (cell === Cell.white_regular && row === 0) {
      return true;
    }
    if (cell === Cell.black_regular && row === grid.length - 1) {
      return true;
    }
    return false;
  },
  get_queen(cell: Cell) {
    if (cell === Cell.white_regular) {
      return Cell.white_queen;
    }
    if (cell === Cell.black_regular) {
      return Cell.black_queen;
    }
    throw new Error("Not valid cell type");
  },
  get_moves_regular(grid: Cell[][], row: number, col: number) {
    const moves: move[] = [];
    const cell = grid[row][col];

    const owner = this.get_player(cell);

    if (owner === Player.none) {
      throw new Error("Cannot get moves from an empty cell");
    }

    const next_row = owner === Player.white ? row - 1 : row + 1;

    if (next_row < 0 || next_row > grid.length - 1) {
      return [];
    }

    const left_move_col = col - 1;
    if (left_move_col >= 0 && grid[next_row][left_move_col] === Cell.empty) {
      moves.push({
        start_row: row,
        start_col: col,
        end_row: next_row,
        end_col: left_move_col,
      });
    }

    const right_move_col = col + 1;
    if (
      right_move_col <= grid.length - 1 &&
      grid[next_row][right_move_col] === Cell.empty
    ) {
      moves.push({
        start_row: row,
        start_col: col,
        end_row: next_row,
        end_col: right_move_col,
      });
    }

    return moves;
  },

  get_moves_queen(grid: Cell[][], row: number, col: number) {
    const moves: move[] = [];

    const go = (row: number, col: number, dir_row: number, dir_col: number) => {
      for (
        let next_row = row + dir_row, next_col = col + dir_col;
        checkBoundsArray([next_row, next_col], grid.length) &&
        grid[next_row][next_col] === Cell.empty; //empty check
        next_row += dir_row, next_col += dir_col //move in the direction
      ) {
        moves.push({
          start_row: row,
          start_col: col,
          end_row: next_row,
          end_col: next_col,
        });
      }
    };

    //top left
    go(row, col, -1, -1);
    //top right
    go(row, col, -1, 1);
    //bottom left
    go(row, col, 1, -1);
    //bottom right
    go(row, col, 1, 1);
    return moves;
  },
  get_moves(grid: Cell[][], row: number, col: number) {
    const cell = grid[row][col];
    const moves = this.is_queen(cell)
      ? this.get_moves_queen(grid, row, col)
      : this.get_moves_regular(grid, row, col);
    return moves;
  },
  move(
    grid: Cell[][],
    start_row: number,
    start_col: number,
    end_row: number,
    end_col: number
  ) {
    const cell = grid[start_row][start_col];
    grid[start_row][start_col] = Cell.empty;
    grid[end_row][end_col] = cell;
    if (this.should_be_queen(grid, end_row, end_col)) {
      grid[end_row][end_col] = this.get_queen(cell);
    }
  },
  get_enemy(cell: Cell) {
    if (cell === Cell.white_regular || cell === Cell.white_queen) {
      return Player.black;
    }
    return Player.white;
  },
  get_other_player(player: Player) {
    return player === Player.white ? Player.black : Player.white;
  },
  get_attacks_regular(grid: Cell[][], row: number, col: number) {
    const attacks: attack[] = [];

    const go = (
      grid: Cell[][],
      row: number,
      col: number,
      dir_row: number,
      dir_col: number
    ) => {
      const player = this.get_player(grid[row][col]);
      const enemy = player === Player.white ? Player.black : Player.white;
      const next_row = row + dir_row;
      const next_col = col + dir_col;
      const next_next_row = next_row + dir_row;
      const next_next_col = next_col + dir_col;
      if (
        checkBoundsArray(
          [next_row, next_col, next_next_row, next_next_col],
          grid.length
        ) &&
        this.get_player(grid[next_row][next_col]) === enemy &&
        grid[next_next_row][next_next_col] === Cell.empty
      ) {
        attacks.push({
          start_row: row,
          start_col: col,
          enemy_row: next_row,
          enemy_col: next_col,
          end_row: next_next_row,
          end_col: next_next_col,
        });
      }
    };

    //top left
    go(grid, row, col, -1, -1);
    //top right
    go(grid, row, col, -1, 1);
    //bottom left
    go(grid, row, col, 1, -1);
    //bottom right
    go(grid, row, col, 1, 1);

    return attacks;
  },
  get_attacks_queen(grid: Cell[][], row: number, col: number) {
    const attacks: attack[] = [];
    const go = (
      grid: Cell[][],
      row: number,
      col: number,
      dir_row: number,
      dir_col: number
    ) => {
      const player = this.get_player(grid[row][col]);
      const enemy = player === Player.white ? Player.black : Player.white;
      let next_row = row + dir_row;
      let next_col = col + dir_col;
      for (
        ;
        checkBoundsArray([next_row, next_col], grid.length) &&
        grid[next_row][next_col] === Cell.empty;
        next_row += dir_row, next_col += dir_col
      ) {}
      const next_next_row = next_row + dir_row;
      const next_next_col = next_col + dir_col;
      if (
        checkBoundsArray(
          [next_row, next_col, next_next_row, next_next_col],
          grid.length
        ) &&
        this.get_player(grid[next_row][next_col]) === enemy &&
        grid[next_next_row][next_next_col] === Cell.empty
      ) {
        attacks.push({
          start_row: row,
          start_col: col,
          enemy_row: next_row,
          enemy_col: next_col,
          end_row: next_next_row,
          end_col: next_next_col,
        });
      }
    };
    //top left
    go(grid, row, col, -1, -1);
    //top right
    go(grid, row, col, -1, 1);
    //bottom left
    go(grid, row, col, 1, -1);
    //bottom right
    go(grid, row, col, 1, 1);

    return attacks;
  },
  get_attacks(grid: Cell[][], row: number, col: number) {
    const cell = grid[row][col];
    const attacks = this.is_queen(cell)
      ? this.get_attacks_queen(grid, row, col)
      : this.get_attacks_regular(grid, row, col);

    return attacks;
  },
  attack(
    grid: Cell[][],
    start_row: number,
    start_col: number,
    enemy_row: number,
    enemy_col: number,
    end_row: number,
    end_col: number
  ) {
    const cell = grid[start_row][start_col];
    grid[start_row][start_col] = Cell.empty;
    grid[enemy_row][enemy_col] = Cell.empty;
    grid[end_row][end_col] = cell;

    if (this.should_be_queen(grid, end_row, end_col)) {
      grid[end_row][end_col] = this.get_queen(cell);
    }
  },

  match_move(moves: move[], end_row: number, end_col: number) {
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].end_row === end_row && moves[i].end_col === end_col) {
        return true;
      }
    }
    return false;
  },

  match_attack(attacks: attack[], end_row: number, end_col: number) {
    for (let i = 0; i < attacks.length; i++) {
      if (attacks[i].end_row === end_row && attacks[i].end_col === end_col) {
        return attacks[i];
      }
    }
    return null;
  },
  copy(grid: Cell[][]) {
    return grid.map((row) => row.slice(0));
  },
  check_win(player: Player, grid: Cell[][]) {
    //first check if the enemy has any checkers left
    //if the enemy doesn't have any, then the player won
    const size = grid.length;
    let has_enemies = false;
    for (let row = 0; row < size; row++) {
      if (has_enemies) {
        break;
      }
      for (let col = 0; col < size; col++) {
        const cell = grid[row][col];
        if (cell === Cell.empty) {
          continue;
        }
        if (this.get_player(cell) !== player) {
          has_enemies = true;
          break;
        }
      }
    }
    if (!has_enemies) {
      return true;
    }

    //check if the enemy has any moves left,
    //if the enemy has a single move left,
    //then the player hasn't won yet
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell = grid[row][col];
        if (cell === Cell.empty) {
          continue;
        }
        if (this.get_player(cell) !== player) {
          if (this.get_moves(grid, row, col).length > 0) {
            return false;
          }
          if (this.get_attacks(grid, row, col).length > 0) {
            return false;
          }
        }
      }
    }
    return true;
  },
};
