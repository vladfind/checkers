import {
  AppBar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Link as RouterLink, useLocation } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import { useEffect, useState } from "react";

import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import PeopleIcon from "@material-ui/icons/People";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import SettingsIcon from "@material-ui/icons/Settings";
import { BotSettings } from "./Bot/BotSettings";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { LogReg } from "../User/LogReg";
import { useAppDispatch, useUser } from "../redux/store";
// import { setName, setRole } from "../redux/userslice";
import { userRole } from "../User/usertypes";
import { Invite } from "./Invite";
import { LANG } from "../lang/lang";
import { logout } from "../redux/userslice";
// import PeopleIcon from "@material-ui/icons/People";
// import GroupAddIcon from "@material-ui/icons/GroupAdd";
// import FileCopyIcon from "@material-ui/icons/FileCopy";
// import SettingsIcon from "@material-ui/icons/Settings";

function getName(location: string) {
  console.log(location);
  switch (location) {
    case "/":
      return LANG.Servers.title;
    case "/servers":
      return LANG.Servers.title;
    case "/ratings":
      return LANG.Ratings.titile;
    case "/bot":
      return LANG.Bot.title;
    case "/offline":
      return LANG.Offline.title;
    case "/story":
      return LANG.Story.title;
    default:
      return "Druven";
  }
}
export const NavBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const title = getName(location.pathname);
  const [botMenu, setBotMenu] = useState(false);
  const [logRegMenu, setLogRegMenu] = useState(false);
  const [accountMenu, setAccountMenu] = useState<HTMLButtonElement | null>(
    null
  );

  const close = () => {
    setOpen(false);
  };
  const [inviteMenu, setInviteMenu] = useState(false);
  const { name, role } = useUser();
  useEffect(() => {
    //close LogReg menu after loggin in
    if (name !== null) {
      setLogRegMenu(false);
    }
  }, [name]);
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">{title}</Typography>
          <IconButton
            onClick={(e) => {
              if (role === userRole.guest) {
                setLogRegMenu(true);
              } else {
                setAccountMenu(e.currentTarget);
              }
            }}
            style={{ marginLeft: "auto" }}
            size="medium"
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <LogReg open={Boolean(logRegMenu)} setOpen={setLogRegMenu} />
      <Menu
        open={Boolean(accountMenu)}
        anchorEl={accountMenu}
        onClose={() => setAccountMenu(null)}
      >
        {role === userRole.admin && (
          <MenuItem component={RouterLink} to="/addroom">
            Додати кімнату
          </MenuItem>
        )}

        {(role === userRole.regular ||
          role === userRole.premium ||
          role === userRole.admin) && (
          <MenuItem component={RouterLink} to="/story">
            {LANG.Story.title}
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            dispatch(logout());
            setAccountMenu(null);
          }}
        >
          {LANG.Navbar.logout}
        </MenuItem>
      </Menu>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        <List>
          {role !== userRole.guest && (
            <ListItem
              onClick={close}
              button
              component={RouterLink}
              to="/ratings"
            >
              <ListItemIcon>
                <SportsEsportsIcon />
              </ListItemIcon>
              <ListItemText primary={LANG.Ratings.titile} />
            </ListItem>
          )}
          <ListItem onClick={close} button component={RouterLink} to="/servers">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={LANG.Servers.title} />
          </ListItem>
          <ListItem onClick={close} button component={RouterLink} to="/offline">
            <ListItemIcon>
              <SupervisedUserCircleIcon />
            </ListItemIcon>
            <ListItemText primary={LANG.Offline.title} />
          </ListItem>
          <ListItem onClick={close} button component={RouterLink} to="/bot">
            <ListItemIcon>
              <DesktopWindowsIcon />
            </ListItemIcon>
            <ListItemText primary={LANG.Bot.title} />
          </ListItem>{" "}
          {/* <ListItem button component={RouterLink} to="/story">
            <ListItemText primary="История" />
          </ListItem>{" "}
          <ListItem button component={RouterLink} to="/create">
            <ListItemText primary="Создать комнату" />
          </ListItem>{" "}
          <ListItem button component={RouterLink} to="/chat">
            <ListItemText primary="Чат" />
          </ListItem> */}
          {title === LANG.Servers.title && (
            <>
              <Divider />
              <ListItem button onClick={() => setInviteMenu(true)}>
                <ListItemIcon>
                  <GroupAddIcon />
                </ListItemIcon>
                <ListItemText primary={LANG.Invite.title} />
              </ListItem>
              <Invite open={inviteMenu} onClose={() => setInviteMenu(false)} />
            </>
          )}
          {title === LANG.Bot.title && (
            <>
              <Divider />
              <ListItem button onClick={() => setBotMenu(true)}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={LANG.BotSettings.title} />
              </ListItem>
            </>
          )}
        </List>
      </SwipeableDrawer>
      <BotSettings open={botMenu} onClose={() => setBotMenu(false)} />
    </>
  );
};
