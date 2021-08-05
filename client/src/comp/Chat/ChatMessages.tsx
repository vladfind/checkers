import {
  Avatar,
  createStyles,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useEffect } from "react";
import { useRef } from "react";
import { chatmessage } from "./Chat";

interface props {
  messages: chatmessage[];
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      maxHeight: "calc((100vh - 80px) * 0.7)",
      overflowY: "auto",
    },
  })
);
export const ChatMessages: React.FC<props> = ({ messages }) => {
  const classes = useStyles();
  const myRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (myRef.current) {
      myRef.current.scrollTop = myRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <List ref={myRef} className={classes.root}>
      {messages.map((message, messageIndex) => {
        const { name, text, time } = message;
        if (
          messageIndex !== 0 &&
          messages[messageIndex - 1].name === name &&
          messages[messageIndex - 1].time === time
        ) {
          return (
            <ListItem
              key={messageIndex}
              style={{ marginTop: 0, paddingTop: 0 }}
            >
              <ListItemIcon></ListItemIcon>
              <ListItemText secondary={text} />
            </ListItem>
          );
        }
        return (
          <ListItem key={messageIndex} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>{name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Grid container spacing={1}>
                  <Grid item>
                    <Typography>{name}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption">{time}</Typography>
                  </Grid>
                </Grid>
              }
              secondary={text}
            />
          </ListItem>
        );
      })}
    </List>
  );
};
