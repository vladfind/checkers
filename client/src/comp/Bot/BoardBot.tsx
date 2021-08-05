import { useEffect, useReducer, useRef, useState } from "react";
import { attack, player, startState } from "../Game/gametypes";
import { useAppBotStore } from "../../redux/store";
import { BoardBase } from "../Game/BoardBase";
import { Logic } from "../Game/Logic";
import { ReducerOffline } from "../Offline/ReducerOffline";
import { getBestMove as Gb1, get_other_player } from "./getBestMove";
import { getBestMove as Gb2, getKid } from "./getMove";
import getBestMove from "./minmax";
import { move } from "./types";
import { LANG } from "../../lang/lang";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function comp(move: move | attack, newMove: move | attack) {
  const keys = Object.keys(move);

  for (const key of keys) {
    const oldMoveVal = (move as any)[key];
    const newMoveVal = (newMove as any)[key];
    if (oldMoveVal !== newMoveVal) {
      alert("PR");
      break;
    }
  }
}

export const BoardBot: React.FC = () => {
  const { me, level } = useAppBotStore();

  const [game, action] = useReducer(ReducerOffline, startState);
  useEffect(() => {
    action({ type: "setMe", me: me });
  }, [me]);

  // const botMust = useRef<attack[] | null>(null);
  useEffect(() => {
    const go = () => {
      if (game.current_player === game.me) {
        return;
      }

      const bestMove = Gb2(
        game.grid,
        level,
        game.current_player,
        game.attacks.length === 0 ? null : game.attacks
      );
      if (bestMove === null) {
        alert("Problem!");
        return;
      }
      if ("enemy_row" in bestMove) {
        action({ type: "botAttack", attack: bestMove });
      } else {
        action({ type: "botMove", move: bestMove });
      }
    };
    const t = setTimeout(go, 500);
    return () => {
      clearTimeout(t);
    };
  }, [game, level]);

  useEffect(() => {
    //TODO fix this gets called twice cuz of game update
    const whiteWin = game.winner === player.white;
    const blackWin = game.winner === player.black;
    if (whiteWin || blackWin) {
      alert(LANG.Game.won(whiteWin ? player.white : player.black));
      action({ type: "restart" });
    }
  }, [game.winner]);

  return <BoardBase game={game} action={action} mode="offline" />;
};
