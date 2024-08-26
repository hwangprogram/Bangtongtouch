import React from "react";

// 컴포넌트
import TextBox from "../atoms/TextBox";

const MainChatCard: React.FC = () => {
  return (
    <div className="p-5 border border-gray-300 flex flex-col items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="size-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
        />
      </svg>

      <div className="pt-4 mx-auto">
        <TextBox text="구미 진평동 626-10" size="xl" />
      </div>
      <div className="pt-1 mx-auto">
        <TextBox text="동향 / 여름에 시원해요" size="sm" />
      </div>
    </div>
  );
};

export default MainChatCard;
