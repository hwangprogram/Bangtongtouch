import React from "react";
import { NavLink } from "react-router-dom";

interface IProductChoiceBoxProps {
  children?: React.ReactNode;
  navLink?: string;
  text?: string;
}

const ProductChoiceBox: React.FC<IProductChoiceBoxProps> = ({
  children,
  navLink,
  text,
}) => {
  return (
    <NavLink to={`${navLink}`}>
      <div
        className={
          "size-64 rounded-3xl bg-white hover:bg-green-color hover:text-white hover:font-bold flex flex-col justify-center items-center gap-2 shadow-lg text-2xl"
        }
      >
        {children}
        {text}
      </div>
    </NavLink>
  );
};

export default ProductChoiceBox;
