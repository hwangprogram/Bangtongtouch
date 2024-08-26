import ChatMsgBox from "../atoms/ChatMsgBox";

interface ChatProps {
  imgUrl?: string;
  key: number;
  chatContent: string;
  chatTime: string;
  flag: boolean;
}

const Chat: React.FC<ChatProps> = ({
  imgUrl,
  key,
  chatContent,
  chatTime,
  flag,
}) => {
  return imgUrl ? ( // imgUrl이 존재하는 경우에만 컴포넌트 렌더링
    <div className="flex mt-3 chattingMessage" key={key}>
      <img
        src={imgUrl}
        alt="프로필 사진"
        className="w-10 h-10 rounded-full me-3"
      />
      <ChatMsgBox message={chatContent} date={chatTime} />
    </div>
  ) : (
    <div className="flex mt-3 chattingMessage justify-end" key={key}>
      <ChatMsgBox
        message={chatContent}
        backgroundColor="bg-lime-500"
        date={chatTime}
        flag={flag}
      />
    </div> // imgUrl이 없는 경우 빈 div 렌더링
  );
};

export default Chat;
