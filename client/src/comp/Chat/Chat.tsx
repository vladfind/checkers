import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { serverIP } from "../../config";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  createStyles,
  FormControl,
  makeStyles,
} from "@material-ui/core";
import { chattext } from "./chatevents";
import React from "react";
import { useUser } from "../../redux/store";
import { useHistory } from "react-router";
import { ChatMessages } from "./ChatMessages";
import { ChatUsers } from "./ChatUsers";
import { ChatSend } from "./ChatSend";
import ChatIcon from "@material-ui/icons/Chat";
import { ChatTabs } from "./ChatTabs";
import { ChatSkeleton } from "./ChatSkeleton";
import { LANG } from "../../lang/lang";

export interface chatmessage {
  name: string;
  text: string;
  time: string;
}

interface props {
  roomId: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // display: "flex",
      // justifyContent: "center",
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  })
);
export const Chat: React.FC<props> = ({ roomId }) => {
  const classes = useStyles();
  const [tab, setTab] = useState(0);

  const { name, role } = useUser();
  //peer stuff
  const socketRef = useRef<Socket>();

  const [socketOn, setSocketOn] = useState(false);
  const history = useHistory();
  useEffect(() => {
    socketRef.current = io(serverIP);

    socketRef.current.emit(chattext.joinChat, roomId, name);

    socketRef.current.on(chattext.joinChat, (status: boolean) => {
      setSocketOn(status);
    });

    socketRef.current.on(
      chattext.message,
      (name: string, text: string, time: string) => {
        setMessages((oldMessages) => {
          return [...oldMessages, { name, text, time }];
        });
      }
    );

    socketRef.current.on(chattext.userJoined, (name: string) => {
      setUsers((oldUsers) => [...oldUsers, name]);
    });

    socketRef.current.on(chattext.userLeft, (name: string) => {
      setUsers((oldUsers) => [
        ...oldUsers.filter((oldUser) => oldUser !== name),
      ]);
    });

    socketRef.current.on(chattext.doubleTab, () => {
      socketRef.current?.close();

      alert("Ви зайшли з іншої вкладки на цю сторінку.");
      history.push("/");
    });

    socketRef.current.on(chattext.kick, () => {
      alert("Вас вигнали з кімнати.");
      history.push("/");
    });

    return () => {
      setUsers([]);
      setMessages([]);
      socketRef.current?.close();
    };
  }, [name, roomId, history]);

  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<chatmessage[]>([]);

  const submitMessage = (text: string) => {
    socketRef.current?.emit(chattext.message, text);
  };

  return (
    <Box className={classes.root}>
      <Card style={{ flexGrow: 1 }}>
        <CardHeader
          avatar={
            <Avatar>
              <ChatIcon />
            </Avatar>
          }
          title={LANG.Chat.title}
          subheader={LANG.Chat.getPlayersCount(users.length)}
        />
        <CardContent>
          {!socketOn && <ChatSkeleton />}
          {socketOn && (
            <>
              <ChatTabs tab={tab} setTab={setTab} />
              {tab === 0 && <ChatMessages messages={messages} />}
              {tab === 1 && <ChatUsers users={users} />}
              {tab === 0 && <ChatSend submitMessage={submitMessage} />}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
