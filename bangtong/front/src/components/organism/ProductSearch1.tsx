import React, { useState } from "react";
import ProductSearchButton from "../atoms/ProductSearchButton";
import ProductSearchChip from "../atoms/ProductSearchChip";
import { DatePicker } from "antd";
import dayjs from "dayjs";

import { productSearchStore } from "../../store/productStore";

interface IProductSearch1Props {
  onNext: () => void;
}

const ProductSearch1: React.FC<IProductSearch1Props> = ({ onNext }) => {
  const { startDate, endDate, setDate } = productSearchStore();
  const [stDate, setStDate] = useState(dayjs(startDate));
  const [edDate, setEdDate] = useState(dayjs(endDate));

  // 변경된 날짜 set
  const handleNext = () => {
    setDate(stDate, edDate);
    onNext();
  };

  const handleStDate = (date: any) => {
    setStDate(date);
  };

  const handleEdDate = (date: any) => {
    setEdDate(date);
  };

  return (
    <div className="text-center">
      <h2 className={"text-xl mb-8"}>
        1. 집에 들어가는 날과 나가는 날을 선택해 주세요.
      </h2>

      <div>
        <div className={"flex flex-row gap-3 mb-8"}>
          <ProductSearchChip
            text={"들어가는 날"}
            backgroundColor={"bg-green-color"}
            color={"text-white"}
          />
          <DatePicker
            className={"text-xl grow placeholder:text-xl rounded-full px-4"}
            placeholder={"YYYY-MM-DD"}
            value={stDate}
            onChange={handleStDate}
            defaultValue={dayjs(startDate, "YYYY-MM-DD")}
          />
        </div>

        <div className={"flex flex-row gap-3 mb-8"}>
          <ProductSearchChip
            text={"나가는 날"}
            backgroundColor={"bg-green-color"}
            color={"text-white"}
          />
          <DatePicker
            className={"text-xl grow placeholder:text-xl rounded-full px-4"}
            placeholder={"YYYY-MM-DD"}
            value={edDate}
            onChange={handleEdDate}
            defaultValue={dayjs(endDate, "YYYY-MM-DD")}
          />
        </div>
      </div>

      <ProductSearchButton
        color={"text-green-color"}
        borderColor={"border-green-color"}
        text={"다음"}
        hoverBackgroundColor={"bg-green-color"}
        hoverColor={"text-white"}
        onClick={handleNext}
      />
    </div>
  );
};

export default ProductSearch1;
