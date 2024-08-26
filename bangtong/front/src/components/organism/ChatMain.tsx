import React from "react";

// 컴포넌트
import TextBox from "../atoms/TextBox";
import ChatBox from "../molecules/ChatBox";

const ChatMain: React.FC = () => {
  return (
    <>
      <div className="md:hidden bg-white pb-5">
        <TextBox
          text="1:1 채팅 목록"
          color="lime-500"
          size="3xl"
          weight="bold"
        />
      </div>
      <div
        className="w-[80vw] h-[70vh] overflow-auto md:hidden"
        id="product-list"
      >
        <ChatBox />
      </div>
      <div className="w-[800px] h-[700px] justify-center items-center hidden md:flex">
        <p className="text-2xl">채팅창을 선택해주세요.</p>
      </div>
    </>
  );
};

export default ChatMain;
