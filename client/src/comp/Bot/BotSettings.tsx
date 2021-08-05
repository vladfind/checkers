import {
  createStyles,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { player } from "../Game/gametypes";
import { setLevel, setMe } from "../../redux/botslice";
import { useAppBotStore, useAppDispatch } from "../../redux/store";
import { LANG } from "../../lang/lang";
import { DialogContent } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(4),
    },
  })
);

interface props {
  open: boolean;
  onClose: () => void;
}

export const BotSettings: React.FC<props> = ({ open, onClose }) => {
  const classes = useStyles();
  const { me, level } = useAppBotStore();
  const dispatch = useAppDispatch();
  return (
    <Dialog open={open} className={classes.root} onClose={onClose}>
      {/* <CardHeader
        title={LANG.BotSettings.title}
        action={
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
      /> */}
      <Grid container wrap="nowrap" justify="space-between" alignItems="center">
        <Grid item>
          <DialogTitle>{LANG.BotSettings.title}</DialogTitle>
        </Grid>
        <Grid item>
          <IconButton onClick={onClose} title={LANG.BotSettings.closeDialog}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <DialogContent dividers>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Typography>{LANG.BotSettings.team}: </Typography>
          </Grid>
          <Grid item>
            <Select
              value={me}
              onChange={(e) => {
                dispatch(setMe(e.target.value as any));
              }}
            >
              <MenuItem value={player.white}>
                {LANG.BotSettings.teamWhite}
              </MenuItem>
              <MenuItem value={player.black}>
                {LANG.BotSettings.teamBlack}
              </MenuItem>
            </Select>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Typography>{LANG.BotSettings.difficulty}:</Typography>
          </Grid>
          <Grid item>
            <Select
              value={level}
              onChange={(e) => {
                dispatch(setLevel(e.target.value as any));
              }}
            >
              <MenuItem value={1}>{LANG.BotSettings.level1}</MenuItem>
              <MenuItem value={3}>{LANG.BotSettings.level3}</MenuItem>
              <MenuItem value={5}>{LANG.BotSettings.level5}</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
