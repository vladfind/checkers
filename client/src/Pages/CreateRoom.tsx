import {
  Avatar,
  Button,
  CircularProgress,
  createStyles,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { MyPaper } from "./MyPaper";
import { useUser } from "../redux/store";
import { serverIP } from "../config";
import { useHistory } from "react-router";

import FileCopyIcon from "@material-ui/icons/FileCopy";
import { lang } from "../lang/lang";
const useStyles = makeStyles((theme) =>
  createStyles({
    link: {
      backgroundColor: theme.palette.action.hover,
      padding: theme.spacing(1),
    },
  })
);
export const CreateRoom: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const { name } = useUser();

  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState<boolean>(false);
  const [roomName, setRoomName] = useState("");

  const [roomId, setRoomId] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const [nextUser, setNextUser] = useState("");

  useEffect(() => {
    let on = true;
    async function go() {
      setLoading(true);

      try {
        const req = await fetch(`${serverIP}/room_get`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ owner: name }),
        });

        if (on) {
          if (req.status === 200) {
            const obj = await req.json();
            setRoomId(obj.roomId);
            setUsers(obj.list);
            setRoomName(obj.roomName);
            setExists(true);
            history.push("/edit");
          } else {
            //not found
            setExists(false);
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    if (name) {
      go();
    } else {
      history.push("/");
    }
    return () => {
      on = false;
    };
  }, [name, history]);

  if (loading) {
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
    <MyPaper>
      <form
        onSubmit={(e) => {
          console.log("submit");
          e.preventDefault();
          setLoading(true);
          if (exists) {
            fetch(`${serverIP}/room_edit`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ owner: name, list: users }),
            })
              .then((res) => {
                if (res.status === 200) {
                  alert("Кімната успішно оновлена");
                }
              })
              .catch((e) => {
                console.log(e);
                alert(lang.tryLater);
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            fetch(`${serverIP}/room_add`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ owner: name, list: users, roomName }),
            })
              .then((res) => {
                if (res.status === 201) {
                  alert("Кімната успішно створена ");
                  res.json().then((obj) => {
                    setRoomId(obj.roomId);
                    setExists(true);
                  });
                  history.push("/edit");
                }
              })
              .catch((e) => {
                console.log(e);
                alert(lang.tryLater);
              })
              .finally(() => {
                setLoading(false);
              });
          }
        }}
      >
        <Grid container justify="space-between">
          <Grid item>
            <TextField
              variant="filled"
              label="Ім'я кімнати"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </Grid>
        </Grid>
        <List
          subheader={
            <ListSubheader>
              Гравці, які можут приєднатися до кімнати
            </ListSubheader>
          }
        >
          {users.map((user, userIndex) => {
            return (
              <ListItem key={userIndex}>
                <ListItemAvatar>
                  <Avatar>{user[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user}
                  primaryTypographyProps={{ style: { whiteSpace: "normal" } }}
                />
                <ListItemIcon>
                  <IconButton
                    title="Видалити"
                    onClick={() => {
                      const next = JSON.parse(JSON.stringify(users));
                      next.splice(userIndex, 1);
                      setUsers(next);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </ListItemIcon>
              </ListItem>
            );
          })}
          <br />
          <TextField
            value={nextUser}
            onChange={(e) => setNextUser(e.target.value)}
            label="Додати гравця"
            variant="outlined"
            fullWidth
            InputProps={
              nextUser.length === 0
                ? {}
                : {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={() => {
                            const next = [...users, nextUser];
                            setNextUser("");
                            setUsers(next);
                          }}
                        >
                          Додати
                        </Button>
                      </InputAdornment>
                    ),
                  }
            }
          />
        </List>
        {roomId && (
          <>
            <Typography>Відправ посилання своєму другові</Typography>
            <Grid
              style={{ width: "100%" }}
              container
              justify="center"
              direction="row"
              alignItems="center"
              wrap="nowrap"
              className={classes.link}
            >
              <Grid item>
                {window.location.origin}/online?id={roomId}
              </Grid>
              <Grid item>
                <IconButton
                  title="Копіювати"
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/online?id=${roomId}`
                      );
                    } catch (error) {}
                  }}
                >
                  <FileCopyIcon />
                </IconButton>
              </Grid>
            </Grid>
          </>
        )}
        <br />
        <Grid container justify="flex-end">
          <Grid item>
            <Button variant="contained" color="secondary" type="submit">
              {exists ? "Оновити" : "Створити"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </MyPaper>
  );
};
