import React, { useEffect, useRef, useState } from "react";

// 컴포넌트
import RollBackBtn from "../atoms/RollBackBtn";
import ChatAdditionalBar from "./ChatAdditionalBar";

// 이미지 소스
import { LoadingOutlined } from "@ant-design/icons";
import { Client, Stomp } from "@stomp/stompjs";
import { useNavigate, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import useUserStore from "../../store/userStore";
import authAxios from "../../utils/authAxios";
import Chat from "../molecules/Chat";
import InputBox from "../molecules/InputBox";
import defaultProfile from "../../assets/defaultprofile.jpg";

interface ChatI {
  chatRoom: number;
  chatContent: string;
  sender: number;
}

interface ShowMessage {
  chatContent: string;
  chatTime: string;
  writerId: number;
}

interface OpponentUser {
  profileImage: string;
  nickname: string;
  userId: number;
}

const ChatDetail: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const userId = useUserStore().id;
  const url: string = `${process.env.REACT_APP_BACKEND_URL}/ws`;
  const connectUrl: string = `/topic/greetings/${roomId}`;
  const sendUrl: string = `/app/hello/${roomId}`;
  const [opponentUser, setOpponentUser] = useState<OpponentUser>();
  const navigate = useNavigate();

  const [connected, setConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<ShowMessage>>([]);
  const [chatMessage, setChatMessage] = useState<string>();
  const [isChatLoaded, setIsChatLoaded] = useState<boolean>();

  const clientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const isComposing = useRef<boolean>(false); // IME 입력 상태를 저장하는 ref

  const addMessage = (message: string) => {
    const parsedJson = JSON.parse(message);
    const jsonStr = parsedJson.data.toString().replace(/^.|.$/g, "");
    const data = JSON.parse("{" + jsonStr + "}");
    const chat: ShowMessage = {
      chatContent: data.chatMessage,
      chatTime: data.chatTime,
      writerId: data.sender,
    };
    setMessages((prev) => [...(prev || []), chat]);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    const loadMessages = async () => {
      await authAxios({
        method: "GET",
        url: `${process.env.REACT_APP_BACKEND_URL}/chatrooms/chat/${roomId}`,
      })
        .then((response) => {
          let userData: OpponentUser;
          setIsChatLoaded(true);
          if (response.data.data.maker.userId === userId) {
            userData = response.data.data.participant;
          } else {
            userData = response.data.data.maker;
          }
          setOpponentUser(userData);
          setMessages(response.data.data.content);
        })
        .catch((error) => {
          console.log(error);
          setIsChatLoaded(false);
        });
    };

    const connectWS = () => {
      if (clientRef.current && clientRef.current.active) {
        return;
      }

      const sock = new SockJS(url);
      clientRef.current = Stomp.over(sock);

      clientRef.current.activate();
      clientRef.current.onConnect = (frame) => {
        setConnected(true);
        clientRef.current!.subscribe(connectUrl, (message) => {
          addMessage(message.body);
        });
      };
    };

    loadMessages();
    connectWS();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [roomId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  const sendMessage = () => {
    if (chatMessage && chatMessage.trim() !== "") {
      const chat: ChatI = {
        chatRoom: parseInt(roomId!!),
        sender: userId,
        chatContent: chatMessage!! + " ",
      };
      clientRef.current?.publish({
        destination: sendUrl,
        body: JSON.stringify({ chat }),
      });
      setChatMessage("");
    }
  };

  return (
    <>
      {isChatLoaded ? (
        <div className="h-[650px] md:h-[700px] w-[80vw] md:w-[800px] p-5">
          <div className="flex items-center border-b border-gray-300">
            <div className="md:hidden">
              <RollBackBtn />
            </div>
            <div className="inline-block text-center h-10 ms-3">
              {opponentUser?.nickname}
            </div>
          </div>
          <div
            id="product-list"
            className="flex-row"
            ref={chatContainerRef}
            style={{
              overflowY: "auto",
              height: "480px",
            }}
          >
            {messages.map((item, index) => (
              <Chat
                chatContent={item.chatContent}
                chatTime={item.chatTime}
                key={index}
                imgUrl={
                  item.writerId === userId
                    ? undefined
                    : opponentUser?.profileImage === null
                      ? defaultProfile
                      : process.env.REACT_APP_BACKEND_SRC_URL +
                        String(opponentUser?.profileImage)
                }
                flag={item.writerId === userId}
              />
            ))}
            <div ref={messagesEndRef} />
            {/* 스크롤 이동을 위한 빈 div */}
          </div>
          <div className="mt-5">
            <ChatAdditionalBar
              roomId={roomId!!}
              reportUserId={opponentUser?.userId!!}
              reportUserNickname={opponentUser?.nickname!!}
            />
          </div>
          <div>
            <InputBox
              placeholder="채팅 입력"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              width={"auto"}
              buttonType="send"
              onCompositionStart={() => (isComposing.current = true)} // 한글 입력 시작 시 IME 상태 시작
              onCompositionEnd={() => (isComposing.current = false)} // 한글 입력 완료 시 IME 상태 종료
              onKeyDown={(e) => {
                if (e.code === "Enter" && !isComposing.current) {
                  if (connected) sendMessage();
                  else alert("연결중입니다. 잠시만 기다려주세요.");
                }
              }}
              onIconClick={sendMessage}
            />
          </div>
        </div>
      ) : (
        <div className="w-[800px] h-[700px] flex justify-center items-center hidden md:flex">
          <LoadingOutlined className="text-xl" />
        </div>
      )}
    </>
  );
};

export default ChatDetail;
