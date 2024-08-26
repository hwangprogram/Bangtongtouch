import React from "react";
import { useState } from "react";

// 컴포넌트
import TabBtn from "../atoms/TabBtn";

interface MultiBtnProps {
  setCategory?: (flag: boolean) => void;
}

const MultiBtn: React.FC<MultiBtnProps> = ({ setCategory = null }) => {
  const [selectedTopic, setSelectedTopic] = useState("전체 게시글");

  function handleSelect(selectedButton: string) {
    setSelectedTopic(selectedButton);
  }

  return (
    <menu className="w-full flex justify-center bg-yellow-300 md:justify-around text-nowrap dark:text-black">
      <TabBtn
        isSelected={selectedTopic === "전체 게시글"}
        onSelect={() => {
          handleSelect("전체 게시글");
          if (setCategory !== null) {
            setCategory(false);
          }
        }}
      >
        전체 게시글
      </TabBtn>
      <TabBtn
        isSelected={selectedTopic === "내 지역 게시글"}
        onSelect={() => {
          handleSelect("내 지역 게시글");
          if (setCategory !== null) {
            setCategory(true);
          }
        }}
      >
        내 지역 게시글
      </TabBtn>
    </menu>
  );
};

export default MultiBtn;
