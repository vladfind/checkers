import { Server, Socket } from "socket.io";
import { events, joinMode } from "../../client/src/comp/Game/events";
import {
  serverState,
  startServerState,
  player as Player,
  move,
  attack,
  cell as Cell,
  player,
} from "../../client/src/comp/Game/gametypes";
import { Logic } from "../../client/src/comp/Game/Logic";
import { Chat } from "./Chat";
import {
  joinGameResponse,
  server_status,
} from "../../client/src/comp/Online/onlinetypes";

import { getGames, getUsers } from "./cols";
interface mySocket {
  name: string | null;
  socket: Socket;
}
export class Room {
  mode: "public" | "private" | "rating";
  owner: string | null;
  /**
   * list of allowed users if the room is not public
   */
  list: string[];

  /**
   * amount a wins a person has to have to join a game,
   * if the mode is rating
   */
  wins: number;
  readonly name: string;
  readonly io: Server;
  status: server_status;
  player1: null | mySocket;
  player2: null | mySocket;
  users: Socket[];
  state: serverState;
  Chat: Chat;
  constructor(
    name: string,
    io: Server,
    set:
      | { type: "public" }
      | { type: "private"; list: string[]; owner: string }
      | { type: "rating"; wins: number } = {
      type: "public",
    }
  ) {
    this.name = name;
    this.io = io;
    this.status = server_status.waiting_all;
    this.player1 = null;
    this.player2 = null;
    this.users = [];
    this.state = JSON.parse(JSON.stringify(startServerState));
    this.Chat = new Chat(io);

    this.mode = set.type;
    this.list = [];
    this.owner = null;

    if (set.type === "private") {
      this.list = set.list;
      this.owner = set.owner;
    }

    if (set.type === "rating") {
      this.wins = set.wins;
    } else {
      this.wins = 0;
    }
  }
  getPlayers() {
    const out: {
      player1: null | string;
      player2: null | string;
    } = { player1: null, player2: null };
    if (this.player1 !== null) {
      const pl1Name = this.player1.name === null ? "Гость" : this.player1.name;
      Object.defineProperty(out, "player1", { value: pl1Name });
    }
    if (this.player2 !== null) {
      const pl2Name = this.player2.name === null ? "Гость" : this.player2.name;
      Object.defineProperty(out, "player2", { value: pl2Name });
    }
    return out;
  }
  async startAdd(socket: Socket, mode: joinMode, name: string | null) {
    switch (this.mode) {
      case "private": {
        if (
          name !== null &&
          (this.list.includes(name) || this.owner === name)
        ) {
          this.add(socket, mode, name);
        } else {
          socket.emit(events.joinGame, joinGameResponse.private);
        }
        break;
      }
      case "public":
        this.add(socket, mode, name);
        break;
      case "rating": {
        try {
          const userCol = await getUsers();
          const person = await userCol.findOne({ name: name || "" });
          if (person) {
            const personWins = person.wins;
            if (personWins >= this.wins) {
              this.add(socket, mode, name);
            } else {
              this.add(socket, "spectator", name);
            }
          } else {
            socket.emit(events.joinGame, joinGameResponse.rating_needLogin);
          }
        } catch (error) {
          socket.emit(events.joinGame, joinGameResponse.unknownError);
        }
        break;
      }
      default: {
        socket.emit(events.joinGame, joinGameResponse.unknownError);
      }
    }
  }
  add(socket: Socket, mode: joinMode, name: string | null) {
    socket.emit(events.joinGame, joinGameResponse.true);
    if (this.player1 === null && (mode === "auto" || mode === "white")) {
      this.player1 = { name, socket };
      console.log("Player1 joined");
      socket.emit(events.setPlayer, Player.white);

      socket.on(events.move, (move: move) => {
        this.tryMove(player.white, move);
      });
      socket.on(events.attack, (attack: attack) => {
        this.tryAttack(player.white, attack);
      });
      socket.on("disconnect", () => {
        console.log("Player1 left");
        if (this.mode === "rating") {
          this.playerWon(player.black);
        }
        this.player1 = null;
      });
    } else if (this.player2 === null && (mode === "auto" || mode === "black")) {
      this.player2 = { name, socket };
      console.log("Player2 joined");
      socket.emit(events.setPlayer, Player.black);

      socket.on(events.move, (move: move) => {
        this.tryMove(player.black, move);
      });
      socket.on(events.attack, (attack: attack) => {
        this.tryAttack(player.black, attack);
      });
      socket.on("disconnect", () => {
        console.log("Player2 left");
        if (this.mode === "rating") {
          this.playerWon(player.white);
        }
        this.player2 = null;
      });
    } else {
      console.log("Spectator joined");
      socket.on("disconnect", () => {
        console.log("Spectator left");
      });
    }

    this.users.push(socket);
    const userIndex = this.users.length;
    socket.emit(events.setCurrentPlayer, this.state.current_player);
    socket.emit(events.setGrid, this.state.grid);
    socket.emit(events.setLocked, this.state.locked);
    socket.on("disconnect", () => {
      this.users.splice(userIndex, 1);
      console.log("Spectator left");
    });
  }
  playerWon(winner: player) {
    this.send({ event: events.playerWon, winner });

    if (this.mode === "rating") {
      const win =
        winner === player.white ? this.player1?.name : this.player2?.name;
      const lost =
        winner === player.white ? this.player2?.name : this.player1?.name;
      getGames().then((gamesCol) => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const time = `${day}.${month}.${year}`;
        gamesCol
          .insertOne({
            name: this.name,
            time,
            winner: win as string,
            loser: lost as string,
          })
          .then((res) => {})
          .catch((e) => {
            console.log(e);
          });
      });
    }

    const ctx = this;
    setTimeout(() => {
      ctx.state = JSON.parse(JSON.stringify(startServerState));
      ctx.send({ event: events.setCurrentPlayer, player: player.white });
      ctx.send({ event: events.setGrid, grid: this.state.grid });
      ctx.send({ event: events.setLocked, check: false });
    }, 500);
  }
  tryMove(player: Player.white | Player.black, move: move) {
    if (
      this.state.current_player !== player ||
      this.state.locked ||
      !Logic.checkBoundsArray(Object.values(move), this.state.grid.length)
    ) {
      return;
    }
    const { start_row, start_col, end_row, end_col } = move;
    //get moves from start row and col
    const moves = Logic.get_moves(this.state.grid, start_row, start_col);

    //we only need check for the end,
    //because all moves are gotten from start row and col
    if (Logic.match_move(moves, end_row, end_col)) {
      Logic.move(this.state.grid, start_row, start_col, end_row, end_col);
      const next_player = Logic.get_other_player(this.state.current_player);
      this.state.current_player = next_player;
      this.send({ event: events.setCurrentPlayer, player: next_player });
      this.send({ event: events.move, move });
      if (Logic.check_win(player, this.state.grid)) {
        this.playerWon(player);
      }
    }
  }

  tryAttack(player: Player.white | Player.black, attack: attack) {
    if (
      this.state.current_player !== player ||
      !Logic.checkBoundsArray(Object.values(attack), this.state.grid.length)
    ) {
      return;
    }

    const { start_row, start_col, enemy_row, enemy_col, end_row, end_col } =
      attack;

    //if the player is locked and tries to move from a cell different
    //than the cell he's locked in
    if (
      this.state.locked &&
      (this.state.locked.row !== start_row ||
        this.state.locked.col !== start_col)
    ) {
      return;
    }

    const attacks = Logic.get_attacks(this.state.grid, start_row, start_col);
    const tryAttack = Logic.match_attack(attacks, end_row, end_col);
    if (tryAttack) {
      Logic.attack(
        this.state.grid,
        start_row,
        start_col,
        enemy_row,
        enemy_col,
        end_row,
        end_col
      );
      this.send({ event: events.attack, attack });
      const next_attacks = Logic.get_attacks(this.state.grid, end_row, end_col);
      if (next_attacks.length === 0) {
        if (this.state.locked) {
          this.state.locked = false;
          this.send({ event: events.setLocked, check: false });
        }

        const next_player = Logic.get_other_player(player);
        this.state.current_player = next_player;
        this.send({ event: events.setCurrentPlayer, player: next_player });
      } else {
        const next_locked = { row: end_row, col: end_col };
        this.state.locked = next_locked;
        this.send({ event: events.setLocked, check: next_locked });
      }
      if (Logic.check_win(player, this.state.grid)) {
        this.playerWon(player);
      }
    }
  }

  send(
    item:
      | { event: events.move; move: move }
      | { event: events.attack; attack: attack }
      | { event: events.setCheck; row: number; col: number; cell: Cell }
      | { event: events.setCurrentPlayer; player: Player.white | Player.black }
      | { event: events.setLocked; check: false | { row: number; col: number } }
      | { event: events.setGrid; grid: Cell[][] }
      | { event: events.playerWon; winner: player }
  ) {
    this.users.forEach((user) => {
      const event = item.event;
      const next: any = { ...item };
      delete next.event;

      user.emit(item.event, ...Object.values(next));
    });
  }
  kickAll(reason: string) {
    this.users.forEach((user) => user.emit(events.kick, reason));
  }
}
