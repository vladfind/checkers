import { Server, Socket } from "socket.io";
import { chattext, chatvoice } from "../../client/src/comp/Chat/chatevents";
interface mySocket {
  peerId: string;
  name: string;
  isReal: boolean;
  socket: Socket;
}
interface textSocket {
  id: string;
  name: string;
  socket: Socket;
}

function getGuestName(textUsers: textSocket[]) {
  let tryName = `Guest #1`;
  for (
    let i = 2;
    textUsers.find((i) => i.name === tryName) !== undefined;
    i++
  ) {
    tryName = `Guest #${i}`;
  }
  return tryName;
}

const getID = (textUsers: textSocket[], name: string) => {
  let tryID = `${name}#1`;
  for (let i = 2; textUsers.find((i) => i.id === tryID) !== undefined; i++) {
    tryID = `${name}#${i}`;
  }
  return tryID;
};

function sendEveryone(textUsers: textSocket[], key: string, ...value: any) {
  for (const user of textUsers) {
    if (value !== undefined) {
      user.socket.emit(key, ...value);
    } else {
      user.socket.emit(key);
    }
  }
}

const hasUser = (textUsers: textSocket[], name: string) => {
  return textUsers.find((user) => user.name === name) !== undefined;
};

/**
 *
 * @param textUsers
 * @returns Get an array of usernames (delete duplicates that happen because of mutiple tabs)
 */
const getUserList = (textUsers: textSocket[]) => {
  const set = new Set<string>();
  textUsers.forEach((user) => set.add(user.name));
  const arr = Array.from(set);
  return arr;
};

export class Chat {
  readonly io: Server;
  voiceUsers: mySocket[];
  textUsers: textSocket[];
  constructor(io: Server) {
    this.io = io;
    this.voiceUsers = [];
    this.textUsers = [];
  }

  addText(socket: Socket, name: string | null) {
    //get a name, and if its's a guest, create one
    const userName = name || getGuestName(this.textUsers);

    //If the user was not here before (check because of multiple tabs)
    if (!hasUser(this.textUsers, userName)) {
      //inform everyone about the new user
      sendEveryone(this.textUsers, chattext.userJoined, userName);
    }
    //add user to the userlist
    const nextId = name === null ? userName : getID(this.textUsers, name);
    this.textUsers.push({ name: userName, socket, id: nextId });
    //inform the user that he's connected
    socket.emit(chattext.joinChat, true);
    //Send a list of previous users to the user
    for (const oldName of getUserList(this.textUsers)) {
      socket.emit(chattext.userJoined, oldName);
    }

    //function of removing user
    const tabClosed = () => {
      //remove user from the userlist
      this.textUsers = this.textUsers.filter((i) => i.id !== nextId);
      //check if there is still a tab opened (check because of mutiple tabs)
      if (!hasUser(this.textUsers, userName)) {
        //inform everyone about the user leaving
        sendEveryone(this.textUsers, chattext.userLeft, userName);
      }
    };

    //attach a remove function
    socket.on(chattext.disconnect, tabClosed);
    //an add message function
    socket.on(chattext.message, (text: string) => {
      const date = new Date();
      const time = `${date.getHours()}:${date.getMinutes()}`;
      sendEveryone(this.textUsers, chattext.message, userName, text, time);
    });
  }

  peerLeft(name: string, peerId: string) {
    console.log(`${name} left`);

    this.voiceUsers = this.voiceUsers.filter((user) => user.name !== name);
    for (const user of this.voiceUsers) {
      user.socket.emit("peerLeft", name, peerId);
    }
  }
  addVoice(socket: Socket) {
    const ctx = this;
    socket.emit(chatvoice.joinVoice);

    socket.onAny((name, ...args) => {
      console.log(name, args);
    });

    socket.on(
      chatvoice.peerId,
      (peerId: string, name: string, isReal: boolean) => {
        const next: mySocket = {
          peerId,
          name,
          isReal,
          socket,
        };

        for (const user of this.voiceUsers) {
          console.log(`${user.name} to ${name}`);
          socket.emit(chatvoice.peerId, user.peerId, user.name, user.isReal);
        }
        this.voiceUsers.push(next);
        const removeLeft = () => {
          socket.removeListener(chatvoice.disconnect, removeLeft);
          socket.removeListener(chatvoice.peerLeft, removeLeft);
          this.peerLeft(name, peerId);
        };

        socket.once(chatvoice.disconnect, removeLeft);
        socket.once(chatvoice.peerLeft, removeLeft);
      }
    );
  }
}
