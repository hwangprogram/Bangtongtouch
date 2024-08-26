import React from "react";
import { useNavigate } from "react-router-dom";

// 이미지 소스
import ArrowBack from "../../assets/ArrowBack.png";

const RollBackBtn: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 뒤로가기
  };

  return (
    <button onClick={handleBack} className="bg-lime-300 w-10 rounded-xl mb-3">
      <img src={ArrowBack} alt="뒤로가기" />
    </button>
  );
};

export default RollBackBtn;
