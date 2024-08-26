import React from "react";

interface IProductSearchSideBarProps {
  backgroundColor?: string;
  textColor?: string;
  accentTextColor?: string;
  isDone2?: boolean;
  isDone3?: boolean;
}

const ProductSearchSideBar: React.FC<IProductSearchSideBarProps> = ({
  backgroundColor,
  textColor,
  accentTextColor,
  isDone2,
  isDone3,
}) => {
  return (
    <div
      className={`${backgroundColor} text-7xl flex justify-center items-center w-1/3 flex-wrap grow max-w-[500px] shrink-0`}
    >
      <div className={`flex flex-col gap-8`}>
        <h1 className={`${accentTextColor} font-bold`}>지금</h1>
        <h1 className={isDone2 ? `${accentTextColor} font-bold` : textColor}>
          내게
        </h1>
        <h1 className={isDone3 ? `${accentTextColor} font-bold` : textColor}>
          필요한 것
        </h1>
      </div>
    </div>
  );
};

export default ProductSearchSideBar;
