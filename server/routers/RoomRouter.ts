import { Router } from "express";
import { backend } from "../../client/src/comp/Online/onlinetypes";
import { Room } from "../src/Room";

const RoomRouter = Router();
export const GoRoomRouter = (roomMap: Map<string, Room>) => {
  RoomRouter.get("/public", (req, res) => {
    const regular: backend.server[] = [];
    roomMap.forEach((room, roomId) => {
      if (room.mode === "public") {
        const { name, status } = room;
        regular.push({
          id: roomId,
          name,
          status,
        });
      }
    });
    res.json(regular);
  });

  RoomRouter.get("/rating", (req, res) => {
    const rating: backend.rating[] = [];
    roomMap.forEach((room, roomId) => {
      if (room.mode === "rating") {
        const { name, status, wins } = room;
        const { player1, player2 } = room.getPlayers();
        rating.push({
          id: roomId,
          name,
          status,
          player1,
          player2,
          wins,
        });
      }
    });
    res.json(rating);
  });

  return RoomRouter;
};
