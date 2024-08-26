import React from "react";

// 컴포넌트
import RoomCountRadioBtn from "../atoms/RoomCountRadioBtn";

interface RadioGroupProps extends React.InputHTMLAttributes<HTMLButtonElement> {
  onChange: (e: any) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ onChange }) => {
  const radioArr = ["1", "2", "3개이상"];
  return (
    <React.Fragment>
      {radioArr.map((s: any) => {
        return (
          <RoomCountRadioBtn
            name="room"
            text={s}
            id={s}
            value={s}
            onChange={onChange}
          />
        );
      })}
    </React.Fragment>
  );
};

export default RadioGroup;
