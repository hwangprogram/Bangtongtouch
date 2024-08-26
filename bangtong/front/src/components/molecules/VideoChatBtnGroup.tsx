import React, { useState } from "react";
import VideoChatBtn from "../atoms/VideoChatBtn";

// 아이콘
import {
  AudioFilled,
  AudioMutedOutlined,
  PhoneOutlined,
  VideoCameraFilled,
  VideoCameraOutlined,
} from "@ant-design/icons";

const VideoChatBtnGroup: React.FC = () => {
  const [isMute, setIsMute] = useState<boolean>(false);
  const [isVideoMute, setIsVideoMute] = useState<boolean>(false);

  const toggleMute = () => {
    setIsMute(!isMute);
  };
  const toggleVideoMute = () => {
    setIsVideoMute(!isVideoMute);
  };

  return (
    <div className="flex flex-wrap flex-row justify-center items-center gap-3">
      {/* 화면 음소거 버튼 */}
      <VideoChatBtn
        icon={!isVideoMute ? VideoCameraFilled : VideoCameraOutlined}
        backgroundColor={!isVideoMute ? "bg-green-400" : "bg-red-500"}
        textColor={!isVideoMute ? "" : "text-white"}
        textSize="text-xl"
        padding="p-4"
        rounded="rounded-full"
        onClick={() => toggleVideoMute()}
      />

      {/* 소리 음소거 버튼 */}
      <VideoChatBtn
        icon={!isMute ? AudioFilled : AudioMutedOutlined}
        backgroundColor={!isMute ? "bg-green-400" : "bg-red-500"}
        textColor={!isMute ? "" : "text-white"}
        textSize="text-xl"
        padding="p-4"
        rounded="rounded-full"
        onClick={() => toggleMute()}
      />

      {/* 화상 채팅 끊기 버튼 */}
      <VideoChatBtn
        icon={PhoneOutlined}
        backgroundColor="bg-red-500"
        textColor="text-white"
        textSize="text-xl"
        padding="p-4"
        rounded="rounded-full"
      />
    </div>
  );
};

export default VideoChatBtnGroup;
