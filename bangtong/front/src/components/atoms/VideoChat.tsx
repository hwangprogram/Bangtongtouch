import {
  AudioFilled,
  AudioMutedOutlined,
  LogoutOutlined,
  VideoCameraFilled,
  VideoCameraOutlined,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io, { Socket } from "socket.io-client";

const VideoChat: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const mystreamRef = useRef<MediaStream | null>(null);

  const [muted, setMuted] = useState<boolean>(false);
  const [cameraOff, setCameraOff] = useState<boolean>(false);

  const myFaceRef = useRef<HTMLVideoElement | null>(null);
  const peerFaceRef = useRef<HTMLVideoElement | null>(null);
  const camerasSelectRef = useRef<HTMLSelectElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // Queue for storing ICE candidates until remote description is set
  const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);

  useEffect(() => {
    const initSocket = () => {
      socketRef.current = io("https://i11d206.p.ssafy.io", {
        path: "/rtc/socket.io/",
        withCredentials: true,
        transports: ["websocket"],
      });

      socketRef.current.on("welcome", handleWelcome);
      socketRef.current.on("offer", handleOffer);
      socketRef.current.on("answer", handleAnswer);
      socketRef.current.on("ice", handleIce);
    };

    const handleWelcome = async () => {
      if (peerConnectionRef.current) {
        try {
          const dataChannel =
            peerConnectionRef.current.createDataChannel("chat");
          dataChannel.addEventListener("message", (event) => {});

          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);
          socketRef.current?.emit("offer", offer, roomId);
        } catch (error) {
          console.error("Error in 'welcome' event handler:", error);
        }
      }
    };

    const handleOffer = async (offer: RTCSessionDescriptionInit) => {
      if (peerConnectionRef.current) {
        try {
          const pc = peerConnectionRef.current;
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socketRef.current?.emit("answer", answer, roomId);

          // Process any queued ICE candidates now that the remote description is set
          iceCandidatesQueue.current.forEach(async (candidate) => {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
              console.error("Error adding queued ICE candidate:", error);
            }
          });
          iceCandidatesQueue.current = []; // Clear the queue
        } catch (error) {
          console.error("Error handling offer:", error);
        }
      }
    };

    const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
      if (peerConnectionRef.current) {
        try {
          const pc = peerConnectionRef.current;
          await pc.setRemoteDescription(new RTCSessionDescription(answer));

          // Process any queued ICE candidates now that the remote description is set
          iceCandidatesQueue.current.forEach(async (candidate) => {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
              console.error("Error adding queued ICE candidate:", error);
            }
          });
          iceCandidatesQueue.current = []; // Clear the queue
        } catch (error) {
          console.error("Error handling answer:", error);
        }
      }
    };

    const handleIce = async (ice: RTCIceCandidateInit) => {
      if (peerConnectionRef.current) {
        try {
          const pc = peerConnectionRef.current;
          if (!pc.remoteDescription) {
            // Queue ICE candidates if remote description is not yet set
            console.warn(
              "Remote description not set yet, queuing ICE candidate."
            );
            iceCandidatesQueue.current.push(ice);
            return;
          }

          await pc.addIceCandidate(new RTCIceCandidate(ice));
        } catch (error) {
          console.error("Error handling ICE candidate:", error);
        }
      }
    };

    const cleanupSocket = () => {
      socketRef.current?.off("welcome", handleWelcome);
      socketRef.current?.off("offer", handleOffer);
      socketRef.current?.off("answer", handleAnswer);
      socketRef.current?.off("ice", handleIce);
      socketRef.current?.disconnect();
    };

    const initCall = async () => {
      await getMedia(camerasSelectRef.current?.value);
      makeConnection();
    };

    initSocket();
    initCall();

    return () => {
      cleanupSocket();
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  const getCameras = async () => {
    if (camerasSelectRef.current) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const currentCamera = mystreamRef.current?.getVideoTracks()[0];

        camerasSelectRef.current.innerHTML = "";
        cameras.forEach((camera) => {
          const option = document.createElement("option");
          option.value = camera.deviceId;
          option.text =
            camera.label ||
            `Camera ${camerasSelectRef.current!!.options.length + 1}`;
          if (currentCamera?.label === camera.label) {
            option.selected = true;
          }
          camerasSelectRef.current!!.appendChild(option);
        });
      } catch (error) {
        console.error("Error getting cameras:", error);
      }
    }
  };

  const getMedia = async (deviceId?: string) => {
    const constraints = deviceId
      ? { audio: true, video: { deviceId: { exact: deviceId } } }
      : { audio: true, video: { facingMode: "user" } };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mystreamRef.current = stream;
      if (myFaceRef.current) {
        myFaceRef.current.srcObject = stream;
      }
      if (!deviceId) {
        await getCameras();
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleMuteClick = () => {
    if (mystreamRef.current) {
      mystreamRef.current
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setMuted(!muted);
    }
  };

  const handleCameraClick = () => {
    if (mystreamRef.current) {
      mystreamRef.current
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setCameraOff(!cameraOff);
    }
  };

  const handleCameraChange = async () => {
    await getMedia(camerasSelectRef.current?.value);
    if (peerConnectionRef.current) {
      const videoTrack = mystreamRef.current?.getVideoTracks()[0];
      const videoSender = peerConnectionRef.current
        .getSenders()
        .find((sender) => sender.track?.kind === "video");
      if (videoTrack && videoSender) {
        videoSender.replaceTrack(videoTrack);
      }
    }
  };

  const makeConnection = () => {
    if (peerConnectionRef.current) {
      console.warn("Closing existing peer connection");
      peerConnectionRef.current.close();
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
          ],
        },
      ],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice", event.candidate, roomId);
      }
    };

    peerConnection.ontrack = (event) => {
      if (peerFaceRef.current) {
        peerFaceRef.current.srcObject = event.streams[0];
      }
    };

    if (mystreamRef.current) {
      mystreamRef.current
        .getTracks()
        .forEach((track) =>
          peerConnection.addTrack(track, mystreamRef.current!!)
        );
    }

    peerConnectionRef.current = peerConnection;

    socketRef.current?.emit("join_room", roomId);
  };

  const navigate = useNavigate();

  return (
    <div className={"w-screen h-screen bg-black fixed top-0 left-0 z-10"}>
      <div id="call">
        <video
          id="peerFace"
          ref={peerFaceRef}
          autoPlay
          playsInline
          className={"w-full h-full fixed top-0 left-0 -scale-x-100"}
        ></video>
        <video
          id="myFace"
          ref={myFaceRef}
          autoPlay
          playsInline
          className={`w-1/6 fixed top-5 right-5 -scale-x-100 ${cameraOff ? "hidden" : ""}`}
        ></video>
        <div
          className={
            "fixed bottom-20 flex flex-row justify-center items-center w-full gap-3"
          }
        >
          <button
            id="mute"
            onClick={handleMuteClick}
            className={`text-white size-14  rounded-full ${muted ? "  bg-red-600" : "bg-green-500"}`}
          >
            {muted ? <AudioMutedOutlined /> : <AudioFilled />}
          </button>
          <button
            id="camera"
            onClick={handleCameraClick}
            className={`text-white size-14 rounded-full  ${cameraOff ? "bg-red-600" : "bg-green-500"}`}
          >
            {cameraOff ? <VideoCameraOutlined /> : <VideoCameraFilled />}
          </button>
          <button
            className={"bg-red-600 size-14 text-white rounded-full"}
            onClick={() => {
              navigate("/chats");
            }}
          >
            <LogoutOutlined />
          </button>
        </div>
        {/*<select*/}
        {/*  id="cameras"*/}
        {/*  ref={camerasSelectRef}*/}
        {/*  onChange={handleCameraChange}*/}
        {/*></select>*/}
      </div>
    </div>
  );
};

export default VideoChat;
