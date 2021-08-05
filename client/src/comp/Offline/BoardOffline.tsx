import { useReducer } from "react";
import { startState } from "../Game/gametypes";
import { ReducerOffline } from "./ReducerOffline";
import { BoardBase } from "../Game/BoardBase";

export const BoardOffline: React.FC = () => {
  const [game, action] = useReducer(ReducerOffline, startState);
  return <BoardBase game={game} action={action} mode="offline" />;
};
