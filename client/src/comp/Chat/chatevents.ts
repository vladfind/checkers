export enum chattext {
  joinChat = "joinChat",
  message = "message",
  userJoined = "userJoined",
  userLeft = "userLeft",
  disconnect = "disconnect",

  /**
   * When user opens the same tab twice
   */
  doubleTab = "doubleTab",

  kick = "kick",
}

export enum chatvoice {
  joinVoice = "joinVoice",
  peerId = "peerId",
  peerLeft = "peerLeft",
  disconnect = "disconnect",
}
