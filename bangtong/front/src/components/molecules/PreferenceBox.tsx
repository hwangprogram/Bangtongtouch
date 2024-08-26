import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUserPreferStore } from "../../store/userStore";

import { CheckOutlined } from "@ant-design/icons";

interface PreferenceBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  delayOrd: number;
  preferenceId: number;
  preferenceName: string;
  preferenceDeposit: number;
  preferenceRent: number;
  regionAddress: string;
  isAnimationCompleted: boolean;
  handlePreferenceDetail: (e: any, prefId: number) => void;
  handlePreferenceApplicate: (prefId: number) => void;
  handlePreferenceDelete: (prefId: number) => void;
}

const PreferenceBox: React.FC<PreferenceBoxProps> = ({
  delayOrd,
  preferenceId,
  preferenceName,
  preferenceDeposit,
  preferenceRent,
  regionAddress,
  isAnimationCompleted,
  handlePreferenceDetail,
  handlePreferenceApplicate,
  handlePreferenceDelete,
}) => {
  const [isBtnHovered, setIsBtnHovered] = useState<boolean>(false); //버튼의 hover 상태를 나타내는 state
  const userPrefId = useUserPreferStore().preferenceId;
  const [isSelected, setIsSelected] = useState<boolean>(
    preferenceId === userPrefId
  );
  const startTime = delayOrd * 0.5;

  useEffect(() => {
    setIsSelected(preferenceId === userPrefId);
  }, [userPrefId, preferenceId]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={
        isAnimationCompleted
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.5 }
      }
      transition={{
        duration: 0.4,
        delay: isAnimationCompleted ? startTime : 0,
        ease: [0, 0.7, 0.2, 1],
      }}
      className={`mt-4 relative flex items-center justify-center 
      rounded-lg border-2 border-lime-400 bg-lime-100 w-full h-20
      transition-colors duration-500 hover:cursor-pointer dark:text-black ${!isBtnHovered ? "hover:bg-lime-400" : ""}`}
      onClick={(e) => handlePreferenceDetail(e, preferenceId)}
    >
      <div className="flex-1 w-1/4 text-base font-bold">{preferenceName}</div>
      <div className="flex flex-initial flex-col w-7/12 text-left min-w-0">
        <div className="flex-1 h-1/2 truncate">위치: {regionAddress}</div>
        <div className="flex-1 h-1/2 truncate">
          <span className="text-bold">보증금:&nbsp;</span>
          {preferenceDeposit}만원 &nbsp;&nbsp;
          <span className="text-bold dark:text-black">월세:&nbsp;</span>{" "}
          {preferenceRent}만원
        </div>
      </div>
      <div className="flex flex-1 flex-col w-2/12">
        <button
          onMouseEnter={() => setIsBtnHovered(true)} // hover될 시 isBtnHovered를 true로 만들어 상단 div의 색 변경을 방지
          onMouseLeave={() => setIsBtnHovered(false)}
          onClick={() => {
            handlePreferenceApplicate(preferenceId);
            setIsSelected(() => preferenceId === userPrefId);
          }}
          className={`border-2 border-yellow-300 w-4/5 hover:bg-yellow-300 transition-colors duration-300 ${isSelected ? "border-yellow-300 bg-yellow-300" : "bg-yellow-100"}`}
        >
          {isSelected ? <CheckOutlined /> : "적용"}
        </button>
        <button
          onMouseEnter={() => setIsBtnHovered(true)}
          onMouseLeave={() => setIsBtnHovered(false)}
          onClick={() => handlePreferenceDelete(preferenceId)}
          className="bg-red-100 mt-3 border-2 border-red-300 w-4/5 hover:bg-red-300 transition-colors duration-300"
        >
          삭제
        </button>
      </div>
    </motion.div>
  );
};

export default PreferenceBox;
