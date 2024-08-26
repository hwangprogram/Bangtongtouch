import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";

// 버튼 컴포넌트가 받을 수 있는 모든 속성을 정의
interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
}

// 버튼 컴포넌트
const TabBtn: React.FC<PropsWithChildren<IButtonProps>> = ({
  children,
  onSelect,
  isSelected,
}) => {
  return (
    <button
      className={`mx-3 py-2 ${isSelected ? "border-b-2 border-black" : undefined}`}
      onClick={onSelect}
    >
      {children}
    </button>
  );
};

export default TabBtn;
