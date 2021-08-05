import { userRole } from "../User/usertypes";

export interface MyError {
  status: number;
  text: string;
}

// export type MyResponse<T> = { data: T } | { err: MyError };

// export const unknownErr = 'un'

export namespace RegisterAPI {
  export interface request {
    email: string;
    name: string;
    password: string;
  }

  export interface response {
    text: string;
  }

  export enum errs {
    notEveryField,
    alreadyHaveEmail,
    alreadyHaveName,
  }
}

export namespace LoginAPI {
  export interface request {
    email: string;
    password: string;
  }

  export interface response {
    name: string;
    role: userRole;
    wins: number;
    token: string;

    text: string;
  }

  export enum errs {
    wrongEmailOrPassword,
  }
}

export namespace LocalLoginAPI {
  export interface request {
    token: string;
  }
  export type response = LoginAPI.response;

  export enum errs {
    wrongToken,
  }
}

export namespace StoryAPI {
  export interface request {}
  export interface story {
    name: string;
    won: boolean;
    date: string;
  }
  export interface response {
    stories: story[];
  }
}
