import React from "react";
import getBestMove1 from "../comp/Bot/minmax";
import { getBestMove as getBestMove2 } from "../comp/Bot/getBestMove";
import { getBestMove as getBestMove3, getKid } from "../comp/Bot/getMove";
import { player as Player, startState } from "../comp/Game/gametypes";
import { Logic } from "../comp/Game/Logic";
import { attack, cell as Cell } from "../comp/Bot/types";
it("certain case", () => {
  const baseGrid = [
    [0, 3, 0, 3, 0, 3, 0, 3],
    [3, 0, 3, 0, 3, 0, 3, 0],
    [0, 0, 0, 3, 0, 3, 0, 3],
    [3, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
  ] as Cell[][];
  const player = Player.black;
  const attacks = null;
  const depth = 5; //need 5 to break

  const move1 = getBestMove1(baseGrid, depth, player, attacks);
  const move2 = getBestMove2(
    baseGrid,
    depth,
    player,
    attacks === null ? [] : attacks
  );
  const move3 = getBestMove3(baseGrid, depth, player, attacks);
  //   expect(move1).toEqual(move2);
  expect(move2).toEqual(move3);
});

it("certain case 2", () => {
  const baseGrid = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 0, 0, 0, 3, 0],
    [0, 3, 0, 3, 0, 3, 0, 3],
    [0, 0, 0, 0, 4, 0, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 3],
    [0, 0, 4, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const player = Player.black;
  const attacks = null;
  const depth = 2;

  const move1 = getBestMove1(baseGrid, depth, player, attacks);
  const move2 = getBestMove2(
    baseGrid,
    depth,
    player,
    attacks === null ? [] : attacks
  );
  const move3 = getBestMove3(baseGrid, depth, player, attacks);
  //   expect(move1).toEqual(move2);
  //   expect(move1).toEqual(move3);
  //   expect(move2).toEqual(move3);
});

it("broad case", () => {
  let baseGrid = Logic.copy(startState.grid);

  const checkWin = () => {
    const whiteWin = Logic.check_win(Player.white, baseGrid);
    const blackWin = Logic.check_win(Player.black, baseGrid);
    return whiteWin || blackWin;
  };

  const depth = 5;
  let player = Player.white;
  let attacks: null | attack[] = null;
  let index = 0;
  while (!checkWin()) {
    const move1 = getBestMove1(baseGrid, depth, player, attacks) || null;
    const move2 = getBestMove2(
      baseGrid,
      depth,
      player,
      attacks === null ? [] : attacks
    );
    const move3 = getBestMove3(baseGrid, depth, player, attacks);
    console.log(index);

    //     expect(move1).toEqual(move2);
    //     expect(move1).toEqual(move3);
    expect(move2).toEqual(move3);
    if (move2 === null) {
      break;
    }
    const next_kid = getKid(baseGrid, player, move2);
    const [next_grid, next_player, next_attacks] = next_kid;
    baseGrid = next_grid;
    player = next_player;
    attacks = next_attacks;
    index++;

    //     expect(move2).toEqual(move3)
  }
});
