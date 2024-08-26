import React from "react";

// 컴포넌트
import InputBox from "./InputBox";

interface InputProps {
  leftText: string;
  rightText: string;
}

const InputGroup: React.FC<InputProps> = ({ leftText, rightText, ...props }) => {
  return (
    <div className="w-full flex justify-between">
      <InputBox
        placeholder={leftText}
        width={"45%"}
      />
      <InputBox
        placeholder={rightText}
        width={"45%"}
      />
  </div>
  )
}

export default InputGroup;