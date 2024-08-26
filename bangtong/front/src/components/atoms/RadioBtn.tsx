import React, { useState } from "react";

interface RadioBtnProps {
  location: string; // 편의점, 마트, 병원 등 해당 장소의 편의시설 이름
}

const RadioBtn: React.FC<RadioBtnProps> = ({ location }) => {
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected(!selected);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`p-2 rounded-full ${selected ? "bg-yellow-300" : "bg-gray-200 text-black"}`}
      >
        {location}
      </button>
    </>
  );
};

export default RadioBtn;
