// Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const VideoButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <VideoButton {...props}>{children}</VideoButton>;
};

export default VideoButton;
