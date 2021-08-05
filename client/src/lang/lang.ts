import { player as Player } from "../comp/Game/gametypes";
import { server_status } from "../comp/Online/onlinetypes";

export namespace LANG {
  export enum Navbar {
    logout = "Logout",
  }
  export enum Login {
    title = "Sign in",
    email = "Email",
    password = "Password",
    login = "Login",
  }
  export enum Reg {
    title = "Sign up",
    name = "Name",
    password = "Password",
    email = "Email",
    create = "Create account",
  }
  export enum Ratings {
    titile = "Ranked games",
  }
  export namespace RatingCard {
    export const game = "Game",
      status = "Status",
      status_waiting_all = "Waiting for players",
      status_waiting_one = "Waiting for player 1",
      status_waiting_two = "Waiting for player 2",
      status_playing = "The game is going",
      watchGame = "Watch the game",
      joinGame = "Join the game",
      Player1 = "Player 1",
      Player2 = "Player 2",
      noPlayer = "Waiting for a player",
      needMoreWins = (needWins: number) =>
        `You need ${needWins} more wins to join this game`;
  }
  export enum Servers {
    title = "Online game",
    startGame = "Start game",
    stopStartGame = "Stop game search",
    findRoom = "Find room",
    roomName = "Room name",
    roomStatus = "Room status",
    playButtonJoin = "Join",
    playButtonWatch = "Watch",
  }
  export enum Story {
    title = "History",
    subheader = "History of ranked games",
    wins = "wins",
    loses = "loses",
    tableName = "Name",
    tableResult = "Result",
    tableDate = "Date",
    resultWin = "Won",
    resultLost = "Lost",
  }
  export enum Bot {
    title = "Play agaianst a computer",
  }
  export enum BotSettings {
    title = "Game settings",
    team = "Team",
    teamWhite = "White",
    teamBlack = "Black",
    difficulty = "Difficulty",
    level1 = "Easy",
    level3 = "Normal",
    level5 = "Hard",
    closeDialog = "Close settings",
  }
  export enum Offline {
    title = "Offline play",
  }

  export enum Invite {
    title = "Invite a friend",
    sendALink = "Send this link to a friend",
    copy = "Copy the link",
    closeMenu = "Close",
  }

  export namespace Chat {
    export const title = "Chat",
      getPlayersCount = (n: number) => `${n} players are in this room`,
      messages = "Messages",
      players = "Players",
      message = "Message",
      sendMessage = "Send";
  }
  export const networkFail = "An error occurred. Try later.";

  export const getServerStatus = (status: server_status): string => {
    switch (status) {
      case server_status.playing:
        return "Game is going on";
      case server_status.waiting_all:
        return "Wating for players";
      case server_status.waiting_one:
        return "Waiting player #1";
      case server_status.waiting_two:
        return "Waiting player #2";
      default:
        return "Maitinance";
    }
  };

  export namespace Game {
    export const won = (player: Player.white | Player.black) =>
      `${player === Player.white ? "Whites" : "Blacks"} won `;
  }
}
export enum lang {
  tryLater = "Сталася помилка. Спробуйте пізніше.",
  needLogin = "Вам потрібно авторизуватися, щоб проглядати цю сторікну",
  buySuccess = "Вітаємо! Ви придбали преміум.",
  onlineErr_ban = "Ви знаходитесь у бані.",
  onlineErr_private = "Це приватна кімната і Ви не маєте до неї доступу.",
  onlineErr_404 = "Кімната не знайдена.",
  onlineErr_unkown = "Сталася помилка. Спробуйте пізніше.",
  rating_needLogin = "Вам потрібно авторизуватися, щоб брати участь в рейтинговій грі. ",
}
