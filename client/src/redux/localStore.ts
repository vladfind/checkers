import { botState } from "./botslice";

export interface saveStateI {
  user: {
    token: string;
  };
  bot: botState;
}
export const loadState = (): saveStateI | undefined => {
  try {
    const state = localStorage.getItem("redux");
    if (state) {
      const parsedState = JSON.parse(state);
      return parsedState;
    }
    return undefined;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const saveState = (state: saveStateI) => {
  try {
    const stringState = JSON.stringify(state);
    localStorage.setItem("redux", stringState);
  } catch (error) {
    console.log(error);
  }
};
