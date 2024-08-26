import React from "react";
import * as AntdIcons from "@ant-design/icons";
import type { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";

type IconType = React.ComponentType<AntdIconProps>;

interface IVideoChatBtnProps extends React.HTMLProps<HTMLDivElement> {
  icon: IconType | keyof typeof AntdIcons;
  backgroundColor?: string;
  textColor?: string;
  textSize?: string;
  padding?: string;
  rounded?: string;
  onClick?: () => void;
}

const VideoChatBtn: React.FC<IVideoChatBtnProps> = ({
  icon,
  backgroundColor,
  textColor,
  textSize,
  padding,
  rounded,
  onClick,
}) => {
  let IconComponent: IconType;

  if (typeof icon === "string") IconComponent = (AntdIcons as any)[icon];
  else IconComponent = icon;

  return (
    <IconComponent
      className={`${backgroundColor} ${padding} ${rounded} ${textColor} ${textSize}`}
      onClick={onClick}
    />
  );
};

export default VideoChatBtn;
