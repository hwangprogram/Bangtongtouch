import React from "react";

interface IProductSearchProps {
  children?: React.ReactNode;
}

const ProductSearch: React.FC<IProductSearchProps> = ({ children }) => {
  return (
    <div className="grow items-center flex flex-col justify-center">
      {children}
    </div>
  );
};

export default ProductSearch;
