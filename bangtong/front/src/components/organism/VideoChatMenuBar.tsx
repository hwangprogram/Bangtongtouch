import React from "react";
import VideoChatBtnGroup from "../molecules/VideoChatBtnGroup";

const VideoChatMenuBar: React.FC = () => {
  return (
    <div className="fixed bottom-0 mx-auto w-full">
      <VideoChatBtnGroup />
    </div>
  );
};

export default VideoChatMenuBar;
