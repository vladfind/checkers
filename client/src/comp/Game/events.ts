export type joinMode = "auto" | "white" | "black" | "spectator";

export enum events {
  joinGame = "joinGame",
  joinedGame = "joinedGame",
  setPlayer = "setPlayer",
  setCurrentPlayer = "setCurrentPlayer",
  setCheck = "setCheck",
  setGrid = "setGrid",
  setLocked = "setLocked",
  move = "move",
  attack = "attack",
  playerWon = "playerWon",
  kick = "kick",
}
