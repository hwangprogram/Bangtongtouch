import React from "react";

interface TextBoxProps {
  text: string; // 들어갈 텍스트
  size?: string; // 텍스트 크기 (xs, sm, base, lg, xl, 2xl, ...)
  color?: string; // 텍스트 색
  weight?: string; // 텍스트 굵기
  darkColor?: string;
}

const TextBox: React.FC<TextBoxProps> = ({
  text,
  size = "sm",
  color,
  weight = "normal",
    darkColor,
  ...props
}) => {
  return (
    <div className={`text-${size} text-${color} font-${weight} dark:text-${darkColor}`} {...props}>
      <p>{text}</p>
    </div>
  );
};

export default TextBox;
