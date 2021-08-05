import { io, Socket } from "socket.io-client";
import { useEffect, useReducer, useRef, useState } from "react";
import {
  move,
  onlineStartState,
  player as Player,
  cell as Cell,
} from "../Game/gametypes";
import { BoardBase } from "../Game/BoardBase";
import { events } from "../Game/events";
import { attack } from "../Bot/Logic";
import { ReducerOnline } from "./ReducerOnline";
import { Logic } from "../Game/Logic";
import { CircularProgress, createStyles, makeStyles } from "@material-ui/core";
import { serverIP } from "../../config";
import { useHistory, useLocation } from "react-router";
import { useUser } from "../../redux/store";
import { joinGameResponse } from "./onlinetypes";
import { Chat } from "../Chat/Chat";
import { lang } from "../../lang/lang";

const useOnline = (): [string | null, string | null] => {
  const queryStr = useLocation().search;
  const [id, setId] = useState(new URLSearchParams(queryStr).get("id"));
  const [mode, setMode] = useState(
    new URLSearchParams(queryStr).get("mode") || "auto"
  );
  useEffect(() => {
    const nextQ = new URLSearchParams(queryStr);
    setId(nextQ.get("id"));
    setMode(nextQ.get("mode") || "auto");
  }, [queryStr]);

  return [id, mode];
};

const useStyles = makeStyles((theme) =>
  createStyles({
    main: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: theme.spacing(1),
      [theme.breakpoints.up("md")]: {
        gridTemplateColumns: "1fr 1fr",
      },
    },
  })
);
export const BoardOnline: React.FC = () => {
  const classes = useStyles();

  const [game, action] = useReducer(ReducerOnline, onlineStartState);
  const socket = useRef<Socket>();
  const [loading, setLoading] = useState(true);
  const { name } = useUser();
  const [id, mode] = useOnline();
  const history = useHistory();

  useEffect(() => {
    socket.current = io(serverIP);
    socket.current.on("connect", () => {});
    socket.current.emit(events.joinGame, id, name, mode);
    socket.current.on(events.joinGame, (response: joinGameResponse) => {
      switch (response) {
        case joinGameResponse.true:
          break;
        case joinGameResponse.banned:
          alert(lang.onlineErr_ban);
          history.push("/");
          break;
        case joinGameResponse.notFound:
          alert(lang.onlineErr_404);
          history.push("/");
          break;
        case joinGameResponse.private:
          alert(lang.onlineErr_private);
          history.push("/");
          break;
        case joinGameResponse.rating_needLogin:
          alert(lang.rating_needLogin);
          history.push("/");
          break;
        case joinGameResponse.unknownError:
          alert(lang.onlineErr_unkown);
          history.push("/");
          break;
        default:
          alert(lang.onlineErr_unkown);
          history.push("/");
          break;
      }

      setLoading(false);
    });
    socket.current.on(
      events.setPlayer,
      (player: Player.white | Player.black) => {
        action({ type: "setMe", me: player });
      }
    );
    //d
    socket.current.on(
      events.setCurrentPlayer,
      (player: Player.white | Player.black) => {
        action({ type: "setCurrentPlayer", player });
      }
    );
    socket.current.on(events.move, (move: move) => {
      action({ type: "onlineMove", move });
    });
    socket.current.on(events.attack, (attack: attack) => {
      action({ type: "onlineAttack", attack });
    });

    socket.current.on(events.setGrid, (grid: Cell[][]) => {
      action({ type: "setGrid", grid });
    });

    socket.current.on(
      events.setLocked,
      (check: null | { row: number; col: number }) => {
        action({ type: "setLocked", check });
      }
    );

    socket.current.on(
      events.playerWon,
      (winner: Player.white | Player.black) => {
        alert(`${winner === Player.white ? "Білі" : "Чорні"} перемогли!`);
      }
    );

    socket.current.on(events.kick, (reason) => {
      alert(reason);
      history.push("/");
    });
    return () => {
      console.log("destroy");

      socket.current?.close();
    };
  }, [name, id, mode, history]);

  const onlineClick = (row: number, col: number) => {
    if (!socket.current || game.current_player !== game.me) {
      return;
    }

    const { grid, locked, check, moves, attacks } = game;
    const cell = grid[row][col];
    const cell_owner = Logic.get_player(cell);

    //Click on our own checker
    if (cell_owner === game.current_player && !locked) {
      //Select a checker
      if (check === null || !(check.row === row && check.col === col)) {
        action({ type: "setCheck", check: { row, col } });
      }
      //Deselect the current checker
      else {
        action({ type: "setCheck", check: null });
      }
    } else if (cell === Cell.empty) {
      if (!check) {
        return;
      }
      if (!locked && Logic.match_move(moves, row, col)) {
        const myMove: move = {
          start_row: check.row,
          start_col: check.col,
          end_row: row,
          end_col: col,
        };
        socket.current.emit(events.move, myMove);
        return;
      }

      const attack = Logic.match_attack(attacks, row, col);
      if (attack) {
        socket.current.emit(events.attack, attack);
      }
    }
  };

  if (loading || !id) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress size="50vw" />
      </div>
    );
  }

  return (
    <div className={classes.main}>
      <BoardBase
        mode="online"
        game={game}
        action={action}
        onlineClick={onlineClick}
      />
      <Chat roomId={id} />
    </div>
  );
};
