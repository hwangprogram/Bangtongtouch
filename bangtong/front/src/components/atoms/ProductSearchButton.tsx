import React from "react";

interface IProductSearchButtonProps {
  borderColor?: string;
  hoverBackgroundColor?: string;
  color?: string;
  hoverColor?: string;
  onClick?: () => void;
  text?: string;
}

const ProductSearchButton: React.FC<IProductSearchButtonProps> = ({
  borderColor,
  hoverColor,
  hoverBackgroundColor,
  color,
  text,
  onClick,
}) => {
  return (
    <button
      className={`border-2 ${borderColor} bg-transparent rounded-full py-1.5 px-6 ${color} hover:${hoverBackgroundColor} hover:border-inherit hover:${hoverColor}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default ProductSearchButton;
