import { createStyles, makeStyles } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import {
  gameState,
  cell as Cell,
  move,
  attack,
  onlineGameState,
  player,
} from "./gametypes";

import imgs from "../../imgs.json";
import { actionOffline } from "../Offline/ReducerOffline";
import { actionOnline } from "../Online/ReducerOnline";
import { Logic } from "./Logic";
import { useMemo } from "react";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
      maxHeight: "100%",
      display: "flex",
      justifyContent: "center",
    },
    row: {
      display: "flex",
      height: "12.5%",
    },

    col: {
      width: "12.5%",
      height: "100%",
      color: "red",
    },
    col_color: {
      backgroundColor: "rbg(255, 255, 255)",
    },
    col_nocolor: {
      backgroundColor: "brown",
    },
    col_my: {
      cursor: "pointer",
    },
    col_black: {
      backgroundImage: `url("${imgs.black}")`,
    },
    col_black_queen: {
      backgroundImage: `url("${imgs.black_queen}")`,
    },
    col_white: {
      backgroundImage: `url("${imgs.white}")`,
    },
    col_white_queen: {
      backgroundImage: `url("${imgs.white_queen}")`,
    },
    col_move: {
      cursor: "pointer",
      backgroundColor: "rgb(7, 170, 7)",
    },
    col_attack: {
      cursor: "pointer",
      backgroundColor: "rgb(230, 18, 18)",
    },
    turn_me: {
      border: " 9px solid rgb(202, 129, 18) ",
    },
    turn_other: {
      border: "9px solid black",
    },
  })
);

type hl = { row: number; col: number; type: hlType };

enum hlType {
  move,
  attack,
}
const useSize = (containerRef: React.RefObject<HTMLDivElement>) => {
  const [size, setSize] = useState(100);
  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) {
        return;
      }
      const multi = 0.95;
      const width = containerRef.current.clientWidth;
      // const height = containerRef.current.clientHeight;
      const height = document.body.clientHeight - 50;
      console.log(width, height);

      const nextSize = Math.min(width, height) * multi;
      setSize(nextSize);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [containerRef]);
  return size;
};

const useHls = (
  moves: move[],
  attacks: attack[],
  me: player,
  current_player: player
) => {
  const hls: hl[] = useMemo(() => {
    if (me !== current_player) {
      return [];
    }
    const next: hl[] = [];
    for (const move of moves) {
      next.push({ row: move.end_row, col: move.end_col, type: hlType.move });
    }
    for (const attack of attacks) {
      next.push({
        row: attack.end_row,
        col: attack.end_col,
        type: hlType.attack,
      });
    }
    return next;
  }, [attacks, moves, me, current_player]);
  // const [hls, setHls] = useState<hl[]>([]);
  // useEffect(() => {
  //   const next: hl[] = [];
  //   moves.forEach((move) => {
  //     next.push({ row: move.end_row, col: move.end_col, type: hlType.move });
  //   });
  //   attacks.forEach((attack) => {
  //     next.push({
  //       row: attack.end_row,
  //       col: attack.end_col,
  //       type: hlType.attack,
  //     });
  //   });
  //   setHls(next);
  // }, [moves, attacks]);
  return hls;
};
const getCssClass = (row: number, col: number, grid: Cell[][], hls: hl[]) => {
  const classes = ["col"];
  if ((0 + row + col) % 2 === 0) {
    classes.push("col_color");
  } else {
    classes.push("col_nocolor");
  }
  const cell = grid[row][col];
  if (cell === Cell.empty) {
  } else if (cell === Cell.white_regular) {
    classes.push("col_white");
  } else if (cell === Cell.white_queen) {
    classes.push("col_white_queen");
  } else if (cell === Cell.black_regular) {
    classes.push("col_black");
  } else if (cell === Cell.black_queen) {
    classes.push("col_black_queen");
  }
  hls.forEach((hl) => {
    if (hl.row === row && hl.col === col) {
      if (hl.type === hlType.move) {
        classes.push("col_move");
      } else {
        classes.push("col_attack");
      }
    }
  });
  return classes;
};

const onClick = (
  game: gameState,
  action: React.Dispatch<actionOffline>,
  row: number,
  col: number,
  mode: "offline" | "bot"
) => {
  const { grid, locked, check, moves, attacks } = game;
  const cell = grid[row][col];
  const cell_owner = Logic.get_player(cell);

  if (mode === "bot" && game.current_player !== game.me) {
    return;
  }

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
    if (!locked && Logic.match_move(moves, row, col)) {
      action({ type: "move", end_row: row, end_col: col });
      return;
    }

    const attack = Logic.match_attack(attacks, row, col);
    if (attack) {
      const { enemy_row, enemy_col } = attack;
      action({
        type: "attack",
        enemy_row,
        enemy_col,
        end_row: row,
        end_col: col,
      });
    }
  }
};

interface propsOfflineAndBot {
  game: gameState;
  action: React.Dispatch<actionOffline>;
  mode: "offline" | "bot";
  onlineClick?: () => void;
  customSize?: number;
}
interface propsOnline {
  game: onlineGameState;
  action: React.Dispatch<actionOnline>;
  onlineClick: (row: number, col: number) => void;
  mode: "online";
}

export const BoardBase: React.FC<propsOfflineAndBot | propsOnline> = ({
  game,
  action,
  mode,
  onlineClick,
}) => {
  const classes = useStyles();

  const containerRef = useRef<HTMLDivElement>(null);

  let size = useSize(containerRef);

  const hls = useHls(game.moves, game.attacks, game.me, game.current_player);
  return (
    <div ref={containerRef} className={classes.root}>
      <div
        className={
          game.current_player === game.me ? classes.turn_me : classes.turn_other
        }
        style={{ width: size, height: size }}
      >
        {game.grid.map((row, rowIndex) => {
          return (
            <div className={classes.row} key={rowIndex}>
              {row.map((col, colIndex) => {
                return (
                  <div
                    className={getCssClass(rowIndex, colIndex, game.grid, hls)
                      .map((_) => (classes as any)[_])
                      .join(" ")}
                    onClick={() => {
                      if (mode === "online" && onlineClick !== undefined) {
                        onlineClick(rowIndex, colIndex);
                      } else if (mode === "offline" || mode === "bot") {
                        onClick(game, action as any, rowIndex, colIndex, mode);
                      }
                    }}
                    key={colIndex}
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
