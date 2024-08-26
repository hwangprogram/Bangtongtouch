import React from "react";
import ProductChoiceBox from "../organism/ProductChoiceBox";
import { EditOutlined, FileSearchOutlined } from "@ant-design/icons";

const ProductChoicePage: React.FC = () => {
  return (
    <div className="flex flex-col flex-wrap justify-center items-center gap-10 w-screen h-screen fixed top-0 left-0 z-50 text-center bg-gradient-to-r from-lime-500 to-yellow-color">
      <h1 className={"text-4xl font-bold leading-3"}>환영합니다!</h1>
      <h1 className={"text-2xl font-bold"}>방통터치에서 매물을</h1>
      <div
        className={"flex flex-row gap-5 flex-wrap justify-center items-center"}
      >
        <ProductChoiceBox
          navLink={"/products/search"}
          text={"검색하기"}
          children={<FileSearchOutlined />}
        />
        <ProductChoiceBox
          navLink="/products/upload"
          text={"올리기"}
          children={<EditOutlined />}
        />
      </div>
    </div>
  );
};

export default ProductChoicePage;
