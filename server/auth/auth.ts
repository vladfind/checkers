import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../../client/src/User/usertypes";
import { LoginAPI } from "../../client/src/redux/APItypes";
const key = "test";

export interface myLocals {
  user: Omit<LoginAPI.response, "text" | "token">;
}

export const getToken = (item: {
  name: User["name"];
  role: User["role"];
  wins: User["wins"];
}) => {
  const token = jwt.sign(item, key);
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const deco = jwt.verify(token, key) as Omit<
      LoginAPI.response,
      "text" | "token"
    >;
    return deco;
  } catch (err) {
    return false;
  }
};

export const authMid = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === undefined) {
    return res.sendStatus(401);
  }

  const user = verifyToken(token);
  if (user === false) {
    return res.sendStatus(403);
  }

  res.locals["user"] = user;
  next();
};
