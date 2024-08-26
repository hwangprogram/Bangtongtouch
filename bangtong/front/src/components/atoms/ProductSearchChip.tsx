import React from "react";

interface IProductSearchChipProps {
  backgroundColor?: string;
  color?: string;
  text?: string;
}

const ProductSearchChip: React.FC<IProductSearchChipProps> = ({
  backgroundColor,
  color,
  text,
}) => {
  return (
    <div className={`${backgroundColor} rounded-full py-1.5 px-6  ${color}`}>
      {text}
    </div>
  );
};

export default ProductSearchChip;
