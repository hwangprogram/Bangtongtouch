import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";

// 버튼 컴포넌트가 받을 수 있는 모든 속성을 정의
interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string; // 버튼의 너비
  height?: string; // 버튼의 높이
  text?: string; // 버튼에 표시될 텍스트
  backgroundColor?: string; // 버튼의 배경색
  textColor?: string; // 텍스트 색
  textSize?: string; // 텍스트 크기
  hoverBackgroundColor?: string; // 호버 시 배경색
  hoverTextColor?: string; // 호버 시 텍스트 색
  borderColor?: string; // 버튼 테두리 색
  borderRadius?: string; // 버튼 테두리 둥글기
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// 버튼 컴포넌트
const Btn: React.FC<PropsWithChildren<IButtonProps>> = ({
  width = "w-36", // 기본 너비
  height = "h-12", // 기본 높이
  text, // text 내용
  backgroundColor, // 버튼색
  borderColor,
  borderRadius = "full", // 기본 테두리 둥글기
  hoverBackgroundColor, // hover
  hoverTextColor,
  textColor,
  textSize = "text-base", // 기본 텍스트 크기
  children,
  onClick,
  ...props
}) => {
  return (
    <button
      className={`text-center font-bold tracking-wider shadow ${width} ${height} ${backgroundColor} ${borderColor} rounded-${borderRadius} ${hoverBackgroundColor} ${hoverTextColor} text-${textColor} ${textSize}`}
      {...props}
      onClick={onClick}
    >
      {text}
      {children}
    </button>
  );
};

export default Btn;
