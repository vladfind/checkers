import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

import { useState } from "react";
import { backend, server_status } from "../Online/onlinetypes";
import { Link as RouterLink } from "react-router-dom";
import { LANG } from "../../lang/lang";
const statusToLabel = (status: server_status) => {
  //TODO this
  switch (status) {
    case server_status.playing:
      return LANG.RatingCard.status_playing;
    case server_status.waiting_all:
      return LANG.RatingCard.status_waiting_all;
    case server_status.waiting_one:
      return LANG.RatingCard.status_waiting_one;
    case server_status.waiting_two:
      return LANG.RatingCard.status_waiting_two;
  }
};
interface props {
  fight: backend.rating;
  playerWins: number;
}

const getButtonLabel = (
  status: server_status,
  wins: number,
  playWins: number
) => {
  if (
    (status === server_status.waiting_all ||
      status === server_status.waiting_one ||
      status === server_status.waiting_two) &&
    playWins >= wins
  ) {
    return LANG.RatingCard.joinGame;
  }
  return LANG.RatingCard.watchGame;
};

export const RatingCard: React.FC<props> = ({ fight, playerWins }) => {
  const { id, name, status, wins, player1, player2 } = fight;
  const [open, setOpen] = useState(true);
  return (
    <Card>
      <CardHeader
        avatar={<Avatar>{name.slice(0, 1)}</Avatar>}
        title={`${LANG.RatingCard.game}: ${name}`}
        subheader={`${LANG.RatingCard.status}: ${statusToLabel(status)}`}
        action={
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
      />
      {open && (
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{LANG.RatingCard.Player1}</TableCell>
                  <TableCell>{LANG.RatingCard.Player2}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {player1 === null ? LANG.RatingCard.noPlayer : player1}
                  </TableCell>
                  <TableCell>
                    {player2 === null ? LANG.RatingCard.noPlayer : player1}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <br />
        </CardContent>
      )}
      <CardActions>
        <Grid container>
          {playerWins < wins && (
            <Grid item xs={12}>
              <Typography variant="overline" style={{ fontSize: "1rem" }}>
                {LANG.RatingCard.needMoreWins(wins - playerWins)}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Grid container item xs={12}>
              <Grid item xs={12}>
                <Button
                  size="large"
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  component={RouterLink}
                  to={`/rating?id=${id}&mode=auto`}
                >
                  {getButtonLabel(status, wins, playerWins)}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
