import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/react";

/**
 *
 * @param err
 * @returns if its an error that was thrown by the server intentionally and has some data
 */
export const IsMyError = (
  err: FetchBaseQueryError | SerializedError | undefined
): err is FetchBaseQueryError => {
  if (err && "data" in err) {
    return true;
  }

  return false;
};

/**
 *
 * @param err
 * @param isLoading it's used to check where a new request has been going, a
 * request can still have an old error while the new hasn't finished
 * @returns If either the user has no connection or the server is down
 */
export const isNetworkFail = (
  err: FetchBaseQueryError | SerializedError | undefined,
  isLoading: boolean = false
): err is SerializedError => {
  if (
    err &&
    "message" in err &&
    err.message === "NetworkError when attempting to fetch resource." &&
    !isLoading
  ) {
    return true;
  } else {
  }
  return false;
};
