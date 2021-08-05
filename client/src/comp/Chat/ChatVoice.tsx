import { Button, ButtonGroup, useMediaQuery } from "@material-ui/core";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { chatvoice } from "./chatevents";
import Peer from "peerjs";

import PhoneIcon from "@material-ui/icons/Phone";
import { serverIP } from "../../config";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import HeadsetIcon from "@material-ui/icons/Headset";
import CallEndIcon from "@material-ui/icons/CallEnd";

const createMediaStreamFake = () => {
  return new MediaStream([createEmptyAudioTrack(), createEmptyVideoTrack()]);
};

const createEmptyAudioTrack = () => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const dst = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  const track = (dst as any).stream.getAudioTracks()[0];
  return Object.assign(track, { enabled: false });
};

const createEmptyVideoTrack = () => {
  const width = 640;
  const height = 480;
  const canvas: any = Object.assign(document.createElement("canvas"), {
    width,
    height,
  });
  (canvas as any).getContext("2d").fillRect(0, 0, width, height);

  const stream = canvas.captureStream();
  const track = stream.getVideoTracks()[0];

  return Object.assign(track, { enabled: false });
};

interface myStream {
  name: string;
  stream: MediaStream;
  real: boolean;
}
interface props {
  name: string;
  roomId: string;
}
export const ChatVoice: React.FC<props> = ({ name, roomId }) => {
  //indicator of connection to chatRoom
  const [inRoom, setInRoom] = useState(false);
  //indicator of sending a real stream
  const [inVoice, setInVoice] = useState(false);

  const socketRef = useRef<Socket>();
  const peerRef = useRef<Peer>();

  const myStreamRef = useRef<MediaStream>();

  //indicator of having stream enabled
  const [streamEnabled, setStreamEnabled] = useState(true);
  //invidicator of autoPlay
  const [autoPlay, setAutoPlay] = useState(true);

  const [audios, setAudios] = useState<myStream[]>([]);
  const [socketOnline, setSocketOnline] = useState(false);

  const smallSize = useMediaQuery("(max-width: 450px)");
  const debug = false;
  useEffect(() => {
    socketRef.current = io(serverIP);
    socketRef.current?.emit(chatvoice.joinVoice, roomId, name);
    (window as any).peerRef = peerRef.current;
    // Object.defineProperty(window, "peerRef", { value: peerRef });
    //get permission to connect to room
    socketRef.current?.on(chatvoice.joinVoice, () => {
      setSocketOnline(true);
    });
    return () => {
      socketRef.current?.close();
      peerRef.current?.destroy();
      myStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
        myStreamRef.current?.removeTrack(track);
      });
      myStreamRef.current = undefined;
    };
  }, [name, roomId]);

  const endCall = () => {
    setInRoom(false);
    setInVoice(false);
    setStreamEnabled(true);
    setAudios([]);
    socketRef.current?.emit(chatvoice.peerLeft);

    //unsubscribe from these listeners
    socketRef.current?.off(chatvoice.peerLeft);
    socketRef.current?.off(chatvoice.peerId);

    peerRef.current?.destroy();
    myStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
      myStreamRef.current?.removeTrack(track);
    });
    myStreamRef.current = undefined;
  };
  const startCall = (stream: MediaStream | undefined = undefined) => {
    setInRoom(true);
    setInVoice(Boolean(stream));

    myStreamRef.current = stream;
    stream?.getTracks().forEach((tr) => {
      tr.addEventListener("ended", () => {
        endCall();
      });
    });
    function addStream(stream: MediaStream, name: string, real: boolean) {
      const next = { stream, name, real };
      setAudios((old) => [...old, next]);
    }
    function delStream(name: string) {
      console.log(`delStream ${name}`);
      setAudios((oldAudios) => {
        return [...oldAudios.filter((a) => a.name !== name)];
      });
    }

    const meReal = stream !== undefined;
    peerRef.current = new Peer();
    peerRef.current.on("open", (myId) => {
      console.log("I send id, name", myId, name);
      socketRef.current?.emit(chatvoice.peerId, myId, name, meReal);
    });

    socketRef.current?.on(
      chatvoice.peerLeft,
      (peerName: string, otherPeerId: string) => {
        console.log("got a peerLeft");
        console.log(`${peerName} left`);
        //the peer destroy method does not work like it's
        //described in the does, we here we close the
        //connection mannually
        if (
          peerRef.current?.connections[otherPeerId] &&
          peerRef.current.connections[otherPeerId][0]
        ) {
          peerRef.current.connections[otherPeerId][0].close();
          delete peerRef.current.connections[otherPeerId];
        }
        delStream(peerName);
      }
    );
    socketRef.current?.on(
      chatvoice.peerId,
      (otherPeerId: string, otherPeerName: string, otherPeerReal: boolean) => {
        console.log(`I am calling ${otherPeerName}`);

        const call =
          stream !== undefined
            ? peerRef.current?.call(otherPeerId, stream, {
                metadata: {
                  callerName: name,
                  callerReal: true,
                },
              })
            : peerRef.current?.call(otherPeerId, createMediaStreamFake(), {
                metadata: {
                  callerName: name,
                  callerReal: false,
                },
              });

        call?.on("stream", (otherPeerStream) => {
          console.log(`I got strem from ${otherPeerName}`);

          addStream(otherPeerStream, otherPeerName, otherPeerReal);
        });
        call?.on("close", () => {
          console.log("Stream end");

          delStream(otherPeerName);
        });
        call?.on("error", (e) => {
          console.log(e);

          delStream(otherPeerName);
        });
      }
    );
    peerRef.current?.on("call", (call) => {
      console.log("Somone calls me");

      const otherPeerName = call.metadata.callerName;
      if (stream) {
        console.log("I answer with stream");

        call.answer(stream);
      } else {
        console.log("I answer with no stream");
        call.answer();
      }
      call.on("stream", (otherPeerStream) => {
        console.log("stream got to me");

        addStream(otherPeerStream, otherPeerName, call.metadata.callerReal);
      });
      call.on("close", () => {
        console.log("stream end");

        delStream(otherPeerName);
      });
      call.on("error", (e) => {
        console.log(e);

        delStream(otherPeerName);
      });
    });
  };

  return (
    <>
      <div style={debug ? {} : { display: "none" }}>
        {audios.map((audio, audioIndex) => {
          if (!audio.real) {
            return null;
          }
          if (audio.stream.getVideoTracks()["length"] === 0) {
            return (
              <audio
                autoPlay={autoPlay}
                style={{ maxWidth: "100%" }}
                key={audioIndex}
                controls
                ref={(el) => {
                  if (el) {
                    el.srcObject = audio.stream;
                  }
                }}
              />
            );
          }
          return (
            <video
              style={{ maxWidth: "100%" }}
              key={audioIndex}
              controls
              ref={(el) => {
                if (el) {
                  el.srcObject = audio.stream;
                }
              }}
            />
          );
        })}
      </div>
      {inRoom && (
        <ButtonGroup
          fullWidth
          orientation={smallSize ? "vertical" : "horizontal"}
        >
          {inVoice && (
            <Button
              startIcon={streamEnabled ? <MicOffIcon /> : <MicIcon />}
              onClick={() => {
                const audioStream = myStreamRef.current?.getTracks()[0];
                if (audioStream) {
                  audioStream.enabled = !audioStream.enabled;
                  setStreamEnabled(audioStream.enabled);
                }
              }}
            >
              {streamEnabled ? "Вимкнути мікрофон" : "Увімкнути мікрофон"}
            </Button>
          )}
          <Button
            startIcon={
              autoPlay ? (
                <HeadsetIcon style={{ color: "red" }} />
              ) : (
                <HeadsetIcon />
              )
            }
            onClick={() => setAutoPlay((oldPlay) => !oldPlay)}
          >
            {autoPlay ? "Вимкнути звук" : "Увімкнути звук"}
          </Button>
          <Button
            startIcon={<CallEndIcon style={{ color: "red" }} />}
            onClick={endCall}
          >
            Вийти
          </Button>
        </ButtonGroup>
      )}
      {!inRoom && (
        <Button
          disabled={!socketOnline}
          startIcon={<PhoneIcon style={{ color: "green" }} />}
          onClick={() => {
            navigator.mediaDevices
              .getUserMedia({ audio: true })
              .then((stream) => {
                startCall(stream);
              })
              .catch((e) => {
                if (e.code === 8) {
                  startCall();
                }
              });
          }}
        >
          Увійти в голосовий чат
          {/* Войти в голосовой чат */}
        </Button>
      )}
      {debug && !inRoom && (
        <ButtonGroup disabled={!socketOnline}>
          <Button disabled>{name}</Button>
          <Button
            onClick={() => {
              navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then((d) => {
                  startCall(d);
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
            startIcon={<PhoneIcon style={{ color: "green" }} />}
          >
            Войти голос
          </Button>
          <Button
            onClick={() => {
              const media: any = {
                video: {
                  mediaSource: "screen",
                },
              };
              navigator.mediaDevices
                .getUserMedia(media)
                .then((d) => {
                  startCall(d);
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
          >
            Войти экран
          </Button>
          <Button
            onClick={() => {
              startCall();
            }}
          >
            Без голоса
          </Button>
        </ButtonGroup>
      )}
    </>
  );
};
