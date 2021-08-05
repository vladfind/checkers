import {
  Button,
  CircularProgress,
  createStyles,
  Grid,
  LinearProgress,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { purple } from "@material-ui/core/colors";
import { useRef, useState } from "react";
import { SubmitBar } from "../SubmitBar";
import { MyPaper } from "../../Pages/MyPaper";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { serverIP } from "../../config";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { qEvents } from "../../qEvents";
import StopIcon from "@material-ui/icons/Stop";
import { useGetRoomsQuery } from "../../redux/API";
import { useMemo } from "react";
import Fuse from "fuse.js";
import { server_status } from "./onlinetypes";
import { Alert, Skeleton } from "@material-ui/lab";
import { LANG } from "../../lang/lang";
import { isNetworkFail } from "../../utils/errorHelp";
import { NetworkFail } from "../../common/NetworkFail";

const useStyles = makeStyles((theme) =>
  createStyles({
    go: {
      fontSize: theme.typography.h5.fontSize,
      padding: theme.spacing(1),
      borderRadius: theme.spacing(1),
      fontWeight: "bold",
    },
    premium: {
      backgroundColor: purple[700],
      color: theme.palette.common.white,
      padding: theme.spacing(2),
      "&:hover": {
        backgroundColor: purple[700],
      },
    },
    even: {},
    odd: {
      backgroundColor: theme.palette.action.hover,
    },
  })
);

export const Servers: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const { isLoading, error, data } = useGetRoomsQuery();

  const [query, setQuery] = useState("");

  const foundRooms = useMemo(() => {
    if (data === undefined) {
      return [];
    }
    if (query.length === 0) {
      return data;
    }

    const fuse = new Fuse(data, { keys: ["name"] });
    const result = fuse.search(query);
    const items = result.map((i) => i.item);
    console.log(items);

    return items;
  }, [data, query]);

  const [searching, setSearching] = useState(false);
  const socketRef = useRef<Socket>();

  const startSeach = () => {
    setSearching(true);
    socketRef.current = io(`${serverIP}`);
    socketRef.current?.emit(qEvents.joinQ);
    socketRef.current?.on(qEvents.joinQ, (id) => {
      history.push(`/online?id=${id}`);
    });
  };

  const endSearch = () => {
    setSearching(false);
    socketRef.current?.close();
  };

  return (
    <MyPaper>
      {isLoading && (
        <>
          <LinearProgress />
          <br />
        </>
      )}
      {isNetworkFail(error, isLoading) && <NetworkFail marginTop={false} />}
      <Grid container justify="center">
        <Grid item xs={12}>
          <Button
            fullWidth
            startIcon={
              searching ? (
                <StopIcon style={{ fontSize: 45 }} />
              ) : (
                <PlayArrowIcon style={{ fontSize: 45 }} />
              )
            }
            endIcon={searching ? <CircularProgress /> : null}
            className={classes.go}
            color="secondary"
            variant="contained"
            onClick={searching ? endSearch : startSeach}
          >
            {searching ? LANG.Servers.stopStartGame : LANG.Servers.startGame}
          </Button>
        </Grid>
      </Grid>
      <br />
      <br />
      <SubmitBar
        label={LANG.Servers.findRoom}
        onSubmit={(searchS) => {
          setQuery(searchS);
        }}
      />
      <TableContainer>
        <Table>
          <colgroup>
            <col width="50%" />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell>{LANG.Servers.roomName}</TableCell>
              <TableCell align="left">{LANG.Servers.roomStatus}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data === undefined && (
              <>
                {new Array(10).fill(0).map((_, i) => (
                  <TableRow
                    key={i}
                    className={i % 2 === 0 ? classes.even : classes.odd}
                  >
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
            {foundRooms.map((server, serverIndex) => {
              const { id, name, status } = server;
              return (
                <TableRow
                  className={serverIndex % 2 === 0 ? classes.even : classes.odd}
                  key={serverIndex}
                >
                  <TableCell>{name}</TableCell>
                  <TableCell
                    align="left"
                    style={
                      status === server_status.playing
                        ? { color: "green", fontWeight: "bold" }
                        : { color: "rgb(253, 142, 0)", fontWeight: "bold" }
                    }
                  >
                    {LANG.getServerStatus(status)}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      color="primary"
                      variant="outlined"
                      component={RouterLink}
                      to={`/online?id=${id}`}
                      title={
                        status === server_status.playing
                          ? LANG.Servers.playButtonWatch
                          : LANG.Servers.playButtonJoin
                      }
                    >
                      {status === server_status.playing
                        ? LANG.Servers.playButtonWatch
                        : LANG.Servers.playButtonJoin}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </MyPaper>
  );
};
