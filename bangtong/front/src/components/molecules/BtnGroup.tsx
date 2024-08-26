import React from "react";
import { productSearchStore } from "../../store/productStore";

interface BtnGroupProps {
  title?: string;
  itemsArray: Array<string>;
  darkTextColor?: string;
}

const BtnGroup: React.FC<BtnGroupProps> = ({
  title,
  itemsArray,
  darkTextColor,
}) => {
  // productSearchStore에서 필요한 것들을 다 가져옴
  const {
    homeType,
    infra,
    rentSupportable,
    furnitureSupportable,
    setHomeType,
    setInfra,
    setRentSupportable,
    setFurnitureSupportable,
  } = productSearchStore();

  // 월세지원 및 가구지원을 하나의 함수로 만들기 위한 함수
  const setAble = (index: number) => {
    if (index === 0) {
      setRentSupportable();
    } else {
      setFurnitureSupportable();
    }
  };

  // 버튼을 반복해서 띄우는 템플릿: 버튼을 눌렀을 때 동작하는 함수와 인덱싱 배열을 지정하고, 이를 렌더링
  const contentBtn = (onClickFtn: any, idxArr: any) => {
    return itemsArray.map((item, index) => {
      return (
        <button
          key={index}
          onClick={() => onClickFtn(index)}
          className={`p-2 px-4 border font-bold hover:bg-lime-200 transition-colors duration-200 rounded-lg m-1 dark:${darkTextColor} ${
            idxArr[index]
              ? "border-lime-400 text-lime-600 bg-lime-200"
              : "text-gray-400 hover:border-lime-400 hover:text-lime-600"
          }`}
        >
          {item}
        </button>
      );
    });
  };

  // title에 따른 인덱스 배열과 함수 분기처리
  let onClickFtn: any;
  let idxArr: any;
  if (title === "집 유형") {
    onClickFtn = setHomeType;
    idxArr = homeType;
  } else if (title === "편의시설") {
    onClickFtn = setInfra;
    idxArr = infra;
  } else if (title === "지원 여부") {
    onClickFtn = setAble;
    idxArr = [rentSupportable, furnitureSupportable];
  }

  return (
    <div className="mt-7">
      <p className="text-center text-lime-600 font-bold">{title}</p>
      <div className="mt-2">{contentBtn(onClickFtn, idxArr)}</div>
    </div>
  );
};

export default BtnGroup;
