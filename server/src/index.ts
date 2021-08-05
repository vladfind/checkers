import cfenv from "cfenv";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { chatvoice, chattext } from "../../client/src/comp/Chat/chatevents";
import { events, joinMode } from "../../client/src/comp/Game/events";
import {
  joinGameResponse,
  backend,
  server_status,
} from "../../client/src/comp/Online/onlinetypes";
import { qEvents } from "../../client/src/qEvents";
import { Room } from "./Room";
import { userRouter } from "../routers/UserRouter";
import { GoRoomRouter } from "../routers/RoomRouter";

function getRandomArbitrary(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function getStatus(val: Room) {
  let status: server_status = server_status.waiting_all;
  if (val.player1 !== null && val.player2 !== null) {
    status = server_status.playing;
  } else {
    if (val.player1 === null && val.player2 !== null) {
      status = server_status.waiting_one;
    } else if (val.player1 !== null && val.player2 === null) {
      status = server_status.waiting_two;
    }
  }
  return status;
}

const appEnv = cfenv.getAppEnv();
const PORT = appEnv.port;
// const PORT = process.env.PORT || 6002;

const app = express();
const httpServer = createServer(app);

const roomMap = new Map<string, Room>();

app.use(cors({ origin: "*" }));
app.use(express.json());
// app.options("*", cors());
app.use("/user", userRouter);
app.use("/rooms", GoRoomRouter(roomMap));

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

for (let roomIndex = 1; roomIndex <= 9; roomIndex++) {
  roomMap.set(`pub_${roomIndex}`, new Room(`Room №${roomIndex}`, io));
}
roomMap.set("ra_1", new Room("The Star", io, { type: "rating", wins: 0 }));
roomMap.set("ra_2", new Room("The Match", io, { type: "rating", wins: 10 }));
// roomMap.set("main", new Room("main", io));

let q: Socket[] = [];

function findWithoutOne(): null | string {
  let answer: null | string = null;
  roomMap.forEach((room, id) => {
    if (
      room.mode === "public" &&
      room.player1 === null &&
      room.player2 !== null
    ) {
      answer = id;
    }
    if (
      room.mode === "public" &&
      room.player1 !== null &&
      room.player2 === null
    ) {
      answer = id;
    }
  });
  return answer;
}
function findWithoutTwo(): null | string {
  let answer: null | string = null;
  roomMap.forEach((room, id) => {
    if (
      room.mode === "public" &&
      room.player1 === null &&
      room.player2 === null
    ) {
      answer = id;
    }
  });
  return answer;
}

function updateQ() {
  const oneRoom = findWithoutOne();
  const twoRoom = findWithoutTwo();

  if (twoRoom && q.length >= 2) {
    q.pop()?.emit(qEvents.joinQ, twoRoom);
    q.pop()?.emit(qEvents.joinQ, twoRoom);
    updateQ();
  } else if (oneRoom && q.length >= 1) {
    q.pop()?.emit(qEvents.joinQ, oneRoom);
    updateQ();
  }
}

io.on("connection", (socket) => {
  socket.on(qEvents.joinQ, () => {
    q.push(socket);

    updateQ();

    socket.on("disconnect", () => {
      q = q.filter((s) => s !== socket);
      updateQ();
    });
  });
  //TODO add ban and admin things
  socket.on(
    events.joinGame,
    async (id: string, name: string | null, mode: joinMode) => {
      if (roomMap.has(id)) {
        await roomMap.get(id)?.startAdd(socket, mode, name);
      } else {
        socket.emit(events.joinGame, joinGameResponse.notFound);
      }
    }
  );

  socket.on(chattext.joinChat, (id: string, name: string | null) => {
    if (roomMap.has(id)) {
      roomMap.get(id)?.Chat.addText(socket, name);
    }
  });
  socket.on(chatvoice.joinVoice, (id: string, name: string) => {
    if (roomMap.has(id)) {
      roomMap.get(id)?.Chat.addVoice(socket);
    }
  });
});

app.get("/", (req, res) => {
  res.status(200).send("hello world!");
});

app.get("/test", (req, res) => {
  res.status(200).json({ text: "hello" });
});

app.get("/servers", (req, res) => {
  const out: backend.server[] = [];
  roomMap.forEach((val, id) => {
    const next = {
      id,
      name: val.name,
      status: getStatus(val),
    };
    if (val.mode === "public") {
      out.push(next);
    }
  });
  res.status(200).json(out);
});

app.get("/ratings", (req, res) => {
  const out: backend.rating[] = [];
  roomMap.forEach((val, id) => {
    const { player1, player2 } = val.getPlayers();
    const next = {
      id,
      name: val.name,
      status: getStatus(val),
      wins: val.wins,
      player1,
      player2,
    };
    if (val.mode === "rating") {
      out.push(next);
    }
  });
  res.status(200).json(out);
});

app.post("/room_add", (req, res) => {
  const { owner, list, roomName } = req.body;
  const nextRoom = new Room(roomName, io, { type: "private", list, owner });
  const nextId = "p_" + String(getRandomArbitrary(0, 10 ^ 7));
  roomMap.set(nextId, nextRoom);
  res.status(201).send({ roomId: nextId, text: "Вдало створено." });
});

app.post("/room_get", (req, res) => {
  const { owner } = req.body;
  let roomId: null | string = null;
  roomMap.forEach((room, id) => {
    if (room.owner === owner) {
      roomId = id;
    }
  });
  if (roomId === null) {
    res.status(201).send({ text: "not found" });
  } else {
    const { name, list } = roomMap.get(roomId) as Room;
    res.status(200).send({ roomId, roomName: name, list });
  }
});

app.post("/room_edit", (req, res) => {
  const { list, owner } = req.body;
  let room: null | Room = null;
  roomMap.forEach((r) => {
    if (r.owner === owner) {
      room = r;
    }
  });
  if (room === null) {
    res.status(404).send({ text: "Кімната не знайдена" });
  } else {
    (room as Room).list = list;
    //TODO add reason here
    (room as Room).kickAll("Кімната була оновлена.");
    res.status(200).send({ text: "Кімната оновлена." });
  }
});

app.delete("/room", (req, res) => {
  const id = req.body.id;
  roomMap.get(id)?.kickAll("Кімната була видалена.");
  roomMap.delete(id);
  res.status(200).send({ text: "Удачно удалена" });
});

app.get("/rooms", (req, res) => {
  const out: any = [];
  roomMap.forEach((room) => {
    out.push({
      name: room.name,
      player1: room.player1?.name,
      player2: room.player2?.name,
      state: room.state,
    });
  });
  res.status(200).json(out);
});

app.get("/chats", (req, res) => {
  const out: any[] = [];
  roomMap.forEach((room) => {
    const text: any[] = [];
    const voice: string[] = [];
    const chat = room.Chat;
    chat.textUsers.forEach((user) => {
      text.push(user.name);
    });
    chat.voiceUsers.forEach((user) => voice.push(user.name));
    out.push({ text, voice });
  });
  res.status(200).json(out);
});

app.post("/server_add", (req, res) => {
  const { roomName, mode, ratingWins } = req.body;
  let duplcate = false;
  roomMap.forEach((room) => {
    if (room.name === roomName) {
      duplcate = true;
    }
  });
  if (duplcate) {
    res.status(200).send({ text: "Кімната з таким ім'ям вже існує" });
  } else {
    const nextRoom =
      mode === "public"
        ? new Room(roomName, io, { type: "public" })
        : new Room(roomName, io, { type: "rating", wins: ratingWins });
    const id = "s_" + String(getRandomArbitrary(0, 10 ^ 7));
    roomMap.set(id, nextRoom);
    res.status(201).send({ text: "Кімната створена" });
  }
});

app.delete("/server/:id", (req, res) => {
  const id = req.params.id as string;
  if (roomMap.has(id)) {
    roomMap.get(id)?.kickAll("Кімната була видалена адміністратором. ");
    roomMap.delete(id);
    res.status(200).send({ text: "Видалено" });
  } else {
    res.status(200).send({ text: "Кімната не знайдена" });
  }
});

// httpServer.listen(PORT, () => {
httpServer.listen(PORT, appEnv.bind, () => {
  console.log(`Listening on ${PORT}`);
});
