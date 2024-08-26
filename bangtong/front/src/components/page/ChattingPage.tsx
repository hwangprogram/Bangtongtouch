import React from "react";
import { Outlet } from "react-router-dom";

// 컴포넌트
import ChatBox from "../molecules/ChatBox";

const ChattingPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="w-80 h-[700px] hidden md:block bg-lime-400 dark:bg-lime-800 overflow-auto text-black rounded-xl"
        id="product-list"
      >
        <ChatBox />
      </div>
      <div className="bg-lime-50 dark:bg-lime-600 text-black rounded-xl mb-[70px] md:mb-0">
        <Outlet />
      </div>
    </div>
  );
};

export default ChattingPage;
