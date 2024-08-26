import React, { useEffect } from "react";
import { productSearchStore } from "../../store/productStore";

import ProductSearchSideBar from "../organism/ProductSearchSideBar";
import ProductSearch from "../organism/ProductSearch";
import ProductSearch1 from "../organism/ProductSearch1";
import ProductSearch2 from "../organism/ProductSearch2";
import ProductSearch3 from "../organism/ProductSearch3";

const ProductSearchPage: React.FC = () => {
  const [isDone2, setIsDone2] = React.useState(false);
  const [isDone3, setIsDone3] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  const { setInitailize } = productSearchStore();

  useEffect(() => {
    setInitailize();
  }, []);

  const goNextStep = () => {
    setCurrentPage((prev) => Math.min(prev + 1, 3));
    if (currentPage === 1) setIsDone2(true);
    if (currentPage === 2) setIsDone3(true);
  };

  const goPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    if (currentPage === 2) setIsDone2(false);
    if (currentPage === 3) setIsDone3(false);
  };

  return (
    <div className="w-screen h-screen fixed bg-white top-0 left-0 md:z-50 flex justify-between flex-row">
      <ProductSearchSideBar
        backgroundColor={"bg-green-color"}
        textColor={"text-white"}
        accentTextColor={"text-yellow-color"}
        isDone2={isDone2}
        isDone3={isDone3}
      />
      <ProductSearch>
        {currentPage === 1 && <ProductSearch1 onNext={goNextStep} />}
        {currentPage === 2 && (
          <ProductSearch2 onPrev={goPrevPage} onNext={goNextStep} />
        )}
        {currentPage === 3 && <ProductSearch3 onPrev={goPrevPage} />}
      </ProductSearch>
    </div>
  );
};

export default ProductSearchPage;
