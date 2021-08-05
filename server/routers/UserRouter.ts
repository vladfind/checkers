import { Router } from "express";
import jwt from "jsonwebtoken";
import { User, userRole } from "../../client/src/User/usertypes";
import {
  RegisterAPI,
  LoginAPI,
  LocalLoginAPI,
  StoryAPI,
  MyError,
} from "../../client/src/redux/APItypes";
import { getGames, getUsers } from "../src/cols";
import { authMid, getToken, myLocals, verifyToken } from "../auth/auth";

export const userRouter = Router();

getUsers().then((userCol) => {
  userRouter.post("/register", async (req, res) => {
    const { email, name, password } = req.body as Partial<RegisterAPI.request>;

    if (!email || !name || !password) {
      const out: MyError = {
        status: RegisterAPI.errs.notEveryField,
        text: "You must enter all field",
      };
      res.status(400).json(out);
      return;
    }
    const emailCand = await userCol.findOne({ email });
    const nameCand = await userCol.findOne({ name });

    if (emailCand || nameCand) {
      const status = emailCand
        ? RegisterAPI.errs.alreadyHaveEmail
        : RegisterAPI.errs.alreadyHaveName;

      const text = emailCand ? "This email is taken." : "This name is taken.";
      const out: MyError = {
        status,
        text,
      };
      res.status(422).json(out);
      return;
    }

    const next: User = {
      name,
      email,
      password,
      role: userRole.guest,
      games: 0,
      wins: 0,
    };

    userCol.insertOne(next);

    const out: RegisterAPI.response = {
      text: "Yay! You've created an account!",
    };

    res.json(out);
  });

  userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body as LoginAPI.request;
    const userTry = await userCol.findOne({ email, password });
    if (userTry === null) {
      const out: MyError = {
        status: LoginAPI.errs.wrongEmailOrPassword,
        text: "Wrong emal or password.",
      };
      res.status(422).json(out);
      return;
    }

    const { name, role, wins } = userTry;
    const token = getToken({ name, role, wins });
    const out: LoginAPI.response = {
      name,
      role,
      wins,
      token,
      text: "Yay! You've logged in!",
    };
    res.json(out);
  });

  userRouter.post("/locallogin", async (req, res) => {
    const { token } = req.body as LocalLoginAPI.request;
    const value = verifyToken(token);
    if (!value) {
      const out: MyError = {
        status: LocalLoginAPI.errs.wrongToken,
        text: "Invalid token",
      };
      res.status(422).json(out);
      return;
    }

    const out: LocalLoginAPI.response = {
      ...value,
      token,
      text: "Yay!",
    };
    res.json(out);
  });
});

getGames().then((gamesCol) => {
  userRouter.get("/history/:name", async (req, res) => {
    interface g {
      name: string;
      won: boolean;
      date: string;
    }
    const name = req.query.name as string;
    const wins = await gamesCol.find({ winner: name });
    const loses = await gamesCol.find({ loser: name });
    const out: g[] = [];

    (await wins.toArray()).forEach((doc) => {
      out.push({ name: doc.name, won: true, date: doc.time });
    });

    (await loses.toArray()).forEach((doc) => {
      out.push({ name: doc.name, won: false, date: doc.time });
    });

    res.status(200).send(out);
  });
  userRouter.get("/history", authMid, async (req, res) => {
    const { user } = res.locals as myLocals;
    const { name } = user;

    const wins = await gamesCol.find({ winner: name }).toArray();
    const loses = await gamesCol.find({ loser: name }).toArray();
    const outArray = [] as StoryAPI.story[];

    for (const win of wins) {
      const { name, time } = win;
      outArray.push({ name, won: true, date: time });
    }
    for (const lost of loses) {
      const { name, time } = lost;
      outArray.push({ name, won: false, date: time });
    }

    const out: StoryAPI.response = {
      stories: outArray,
    };
    res.json(out);
  });
});
