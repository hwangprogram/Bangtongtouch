import React from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

// 컴포넌트
import TextBox from "../atoms/TextBox";

const ProductPage: React.FC = () => {
  return (
    <div className="w-full mx-3 mb-3">
      <Link to="/products" className="md:hidden">
        <TextBox
          text="방통 터치하기"
          color="lime-500"
          size="3xl"
          weight="bold"
        />
      </Link>
      <Outlet />
    </div>
  );
};

export default ProductPage;
