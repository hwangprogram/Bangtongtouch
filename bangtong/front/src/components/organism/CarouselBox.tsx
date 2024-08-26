import React from "react";

// 컴포넌트

// 이모티콘
import { PlusSquareFilled } from "@ant-design/icons";

// 데이터
import { useUserPreferStore } from "../../store/userStore";

const CarouselBox: React.FC = () => {
  const { regionAddress } = useUserPreferStore();

  return (
    <div className="mt-10">
      <div className="text-center mb-1">
        <PlusSquareFilled className="text-2xl hidden md:block" />
      </div>
      <p className="mb-3 md:text-xl md:text-center">
        <span className="font-bold">{regionAddress}</span>에 새로 올라온 승계
        원룸입니다.
      </p>
    </div>
  );
};

export default CarouselBox;
