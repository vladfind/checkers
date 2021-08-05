import {
  createStyles,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
} from "@material-ui/core";
import { useState } from "react";
import { LANG } from "../lang/lang";
import { Login } from "./Login";
import { Reg } from "./Reg";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) =>
  createStyles({
    closeIcon: {
      position: "absolute",
      top: 0,
      right: theme.spacing(1),
      // marginRight: theme.spacing(1),
    },
  })
);

interface props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const LogReg: React.FC<props> = ({ open, setOpen }) => {
  const classes = useStyles();
  const [tab, setTab] = useState(0);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <div style={{ position: "relative" }}>
        <Tabs centered value={tab} onChange={(e, nextVal) => setTab(nextVal)}>
          <Tab label={LANG.Login.title} />
          <Tab label={LANG.Reg.title} />
        </Tabs>
        <IconButton
          className={classes.closeIcon}
          // style={{ position: "absolute", top: 0, right: "theme.spacing(1)" }}
          onClick={() => setOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent>
        {tab === 0 && <Login />}
        {tab === 1 && <Reg />}
      </DialogContent>
    </Dialog>
  );
};
