import React, { useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { productSearchStore } from "../../store/productStore";

import { Input } from "antd";
import ProductSearchButton from "../atoms/ProductSearchButton";

interface IProductSearch2Props {
  onPrev: () => void;
  onNext: () => void;
}

const sidoMagicTable: any = {
  서울: "서울특별시",
  부산: "부산광역시",
  대구: "대구광역시",
  인천: "인천광역시",
  광주: "광주광역시",
  대전: "대전광역시",
  울산: "울산광역시",
  경기: "경기도",
  강원특별자치도: "강원도",
  충북: "충청북도",
  충남: "충청남도",
  전북특별자치도: "전라북도",
  전남: "전라남도",
  경북: "경상북도",
  경남: "경상남도",
  제주특별자치도: "제주도",
};

const ProductSearch2: React.FC<IProductSearch2Props> = ({ onPrev, onNext }) => {
  const { address, setAddress } = productSearchStore();
  const [inputAddress, setInputAddress] = useState<string>(address);

  const handleNext = () => {
    setAddress(inputAddress);
    onNext();
  };

  // 주소검색 팝업 부분
  const open = useDaumPostcodePopup();
  const handleComplete = (data: any) => {
    const { sido, sigungu, bname2 } = data;
    const newAddress = sidoMagicTable[sido] + " " + sigungu + " " + bname2;
    setInputAddress(newAddress);
  };

  // 주소검색 팝업 열기
  const handleAddressPopUp = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <div className="text-center">
      <h2 className={"text-xl mb-8"}>2. 어디에 살고 싶은지 말해 주세요.</h2>

      <Input.Search
        placeholder={"주소 검색"}
        className="rounded-full mb-8 px-4 focus:border-green-color hover:border-green-color"
        onSearch={handleAddressPopUp}
        value={inputAddress}
      />

      <div className={"flex flex-row gap-3 text-center justify-center"}>
        <ProductSearchButton
          color={"text-green-color"}
          borderColor={"border-green-color"}
          text={"이전"}
          hoverBackgroundColor={"bg-green-color"}
          hoverColor={"text-white"}
          onClick={onPrev}
        />
        <ProductSearchButton
          color={"text-green-color"}
          borderColor={"border-green-color"}
          text={"다음"}
          hoverBackgroundColor={"bg-green-color"}
          hoverColor={"text-white"}
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default ProductSearch2;
