import { Logic } from "../../client/src/comp/Game/Logic";
import {
  player as Player,
  cell as Cell,
  attack,
  move,
} from "../../client/src/comp/Game/gametypes";

const BaseGrid: Cell[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

describe("Logic", () => {
  it("is_queen", () => {
    expect(Logic.is_queen(Cell.empty)).toBe(false);
    expect(Logic.is_queen(Cell.black_queen)).toBe(true);
    expect(Logic.is_queen(Cell.white_queen)).toBe(true);
    expect(Logic.is_queen(Cell.black_regular)).toBe(false);
    expect(Logic.is_queen(Cell.white_regular)).toBe(false);
  });

  it("get_player", () => {
    expect(Logic.get_player(Cell.empty)).toBe(Player.none);
    expect(Logic.get_player(Cell.black_queen)).toBe(Player.black);
    expect(Logic.get_player(Cell.white_queen)).toBe(Player.white);
    expect(Logic.get_player(Cell.black_regular)).toBe(Player.black);
    expect(Logic.get_player(Cell.white_regular)).toBe(Player.white);
  });

  it("should_be_queen", () => {
    const grid1 = Logic.copy(BaseGrid);
    grid1[0][1] = Cell.white_regular;
    expect(Logic.should_be_queen(grid1, 0, 1)).toBe(true);

    const grid2 = Logic.copy(BaseGrid);
    grid2[1][0] = Cell.white_regular;
    expect(Logic.should_be_queen(grid1, 1, 0)).toBe(false);

    const grid3 = Logic.copy(BaseGrid);
    grid3[7][0] = Cell.black_regular;
    expect(Logic.should_be_queen(grid3, 7, 0)).toBe(true);

    const grid4 = Logic.copy(BaseGrid);
    grid4[6][0] = Cell.black_regular;
    expect(Logic.should_be_queen(grid4, 6, 0)).toBe(false);
  });

  it("get_queen", () => {
    expect(Logic.get_queen(Cell.white_regular)).toBe(Cell.white_queen);
    expect(Logic.get_queen(Cell.black_regular)).toBe(Cell.black_queen);
    expect(function () {
      Logic.get_queen(Cell.empty);
    }).toThrowError(new Error("Not valid cell type"));
    expect(function () {
      Logic.get_queen(Cell.white_queen);
    }).toThrowError(new Error("Not valid cell type"));
    expect(function () {
      Logic.get_queen(Cell.black_queen);
    }).toThrowError(new Error("Not valid cell type"));
  });

  describe("get_moves (regular)", () => {
    const getMove = (
      start_row: number,
      start_col: number,
      end_row: number,
      end_col: number
    ): move => {
      return { start_row, start_col, end_row, end_col };
    };

    it("get two moves", () => {
      const grid1 = Logic.copy(BaseGrid);

      grid1[1][2] = Cell.white_regular;

      const topLeft = getMove(1, 2, 0, 1);
      const topRight = getMove(1, 2, 0, 3);
      expect(Logic.get_moves(grid1, 1, 2)).toEqual([topLeft, topRight]);
    });
    it("get one move", () => {
      const grid1 = Logic.copy(BaseGrid);

      grid1[1][0] = Cell.white_regular;

      const top = getMove(1, 0, 0, 1);
      expect(Logic.get_moves(grid1, 1, 0)).toEqual([top]);
    });
  });
  describe("get_attacks (regular)", () => {
    const getAttack = (
      start_row: number,
      start_col: number,
      enemy_row: number,
      enemy_col: number,
      end_row: number,
      end_col: number
    ): attack => {
      return { start_row, start_col, enemy_row, enemy_col, end_row, end_col };
    };

    it("no attacks", () => {
      const grid1 = Logic.copy(BaseGrid);
      grid1[1][0] = Cell.white_regular;

      grid1[0][1] = Cell.black_regular;

      expect(Logic.get_attacks(grid1, 5, 2)).toEqual([]);
    });

    it("4 attacks", () => {
      const grid1 = Logic.copy(BaseGrid);
      grid1[5][2] = Cell.white_regular;

      grid1[4][1] = Cell.black_regular;
      grid1[4][3] = Cell.black_regular;
      grid1[6][3] = Cell.black_regular;
      grid1[6][1] = Cell.black_regular;

      const topLeft = getAttack(5, 2, 4, 1, 3, 0);
      const topRight = getAttack(5, 2, 4, 3, 3, 4);
      const botRight = getAttack(5, 2, 6, 3, 7, 4);
      const botLefft = getAttack(5, 2, 6, 1, 7, 0);
      expect(Logic.get_attacks(grid1, 5, 2)).toEqual([
        topLeft,
        topRight,
        botLefft,
        botRight,
      ]);
    });
  });
});
