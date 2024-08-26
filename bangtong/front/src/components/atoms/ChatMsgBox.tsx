import React from "react";

interface ChatMsgBoxProps {
  message: string; // 채팅 메시지 내용
  date: string; // 날짜, 시간
  backgroundColor?: string;
  flag?: boolean;
}

const ChatMsgBox: React.FC<ChatMsgBoxProps> = ({
  message,
  date,
  backgroundColor = "bg-gray-200",
  flag = false,
}) => {
  return (
    <div className={`${backgroundColor} border-solid p-3 rounded-lg`}>
      <p className={`${flag === true ? "text-right" : null}`}>{message}</p>
      <p
        className={`text-xs text-gray-500 ${flag === true ? "text-right" : null}`}
      >
        {date}
      </p>
    </div>
  );
};

export default ChatMsgBox;
