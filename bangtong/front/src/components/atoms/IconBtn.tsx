import React from "react";

interface IconBtnProps extends React.HTMLAttributes<HTMLDivElement> {
  imgSrc: string; // 아이콘의 이미지 경로
  size?: number; // 버튼 사이즈 (정사각형 가로x세로 동일)
  onIconClick?: React.MouseEventHandler;
}

const IconBtn: React.FC<IconBtnProps> = ({
  imgSrc,
  size,
  onIconClick, // Icon 클릭 시 별도의 로직을 작성하기 위해 onIconClick 추가

  ...props
}) => {
  const buttonStyle: React.CSSProperties = {
    flexShrink: 0, // 축소되는 것 방지
  };
  return (
    <div
      className="rounded hover:cursor-pointer"
      style={buttonStyle}
      {...props}
    >
      <img
        src={imgSrc}
        alt="아이콘 이미지"
        width={size}
        height={size}
        onClick={onIconClick}
        className="hover:cursor-pointer"
      />
    </div>
  );
};

export default IconBtn;
