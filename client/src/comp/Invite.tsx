import {
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useLocation } from "react-router";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CloseIcon from "@material-ui/icons/Close";
import { LANG } from "../lang/lang";
interface props {
  open: boolean;
  onClose: () => void;
}
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    link: {
      backgroundColor: theme.palette.action.hover,
      padding: theme.spacing(1),
    },
  })
);
export const Invite: React.FC<props> = ({ open, onClose }) => {
  const query = useQuery();
  const classes = useStyles();
  const link = `${window.location.origin}/online?id=${query.get(
    "id"
  )}&mode=auto`;

  return (
    <Dialog open={open} onClose={onClose}>
      <Grid container wrap="nowrap" justify="space-between" alignItems="center">
        <Grid item>
          <DialogTitle>{LANG.Invite.sendALink}</DialogTitle>
        </Grid>
        <Grid item>
          <IconButton onClick={onClose} title={LANG.Invite.closeMenu}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <DialogContent dividers>
        <Grid
          container
          direction="row"
          alignItems="center"
          wrap="nowrap"
          className={classes.link}
        >
          <Grid item>
            <Typography>{link}</Typography>
          </Grid>
          <Grid item>
            <IconButton
              title={LANG.Invite.copy}
              onClick={() => {
                try {
                  navigator.clipboard.writeText(link);
                } catch (error) {}
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
