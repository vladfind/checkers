export enum server_status {
  waiting_all = "Очікування гравців",
  waiting_one = "Очікування гравця №1",
  waiting_two = "Очікування гравця №2",
  playing = "Гра йде",
}
export namespace backend {
  export interface server {
    id: string;
    name: string;
    status: server_status;
  }
  export interface rating {
    id: string;
    name: string;
    status: server_status;
    wins: number;
    player1: string | null;
    player2: string | null;
  }
  export interface privateRoom {
    name: string;
    owner: string;
    list: string[];
  }
}

export enum joinGameResponse {
  true = "true",
  /**
   * Room is private and youre not in the list
   */
  private = "private",
  /**
   * You are banned
   */
  banned = "banned",
  /**
   * Room is not found
   */
  notFound = "notFound",
  /**
   * When it's rating and you don't have enought wins
   */
  ratingNotEnough = "ratingNotEnough",
  rating_needLogin = "rating_needLogin",
  unknownError = "unknownErorr",
}
