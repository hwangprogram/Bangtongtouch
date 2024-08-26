import React from "react";

interface RadioBtnProps {
  text: string;
  name: string;
  id: string;
  value: string;
  onChange?: (e: any) => void;
}

const RoomCountRadioBtn: React.FC<RadioBtnProps> = ({
  text,
  name,
  id,
  value,
  onChange,

  ...props
}) => {
  return (
    <label htmlFor={id}>
      <input
        type="radio"
        className="me-1 ms-3"
        name={name}
        id={id}
        value={value}
        onChange={onChange}
      />
      {text}
    </label>
  );
};

export default RoomCountRadioBtn;
