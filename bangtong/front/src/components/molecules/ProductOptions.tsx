import React from "react";

// 컴포넌트
import OptionIcon from "../atoms/OptionIcon";

// 이미지 소스
import GreenBed from "../../assets/GreenBed.png";
import GreenStove from "../../assets/GreenStove.png";
import GreenFridge from "../../assets/GreenFridge.png";
import GreenWashingMachine from "../../assets/GreenWashingMachine.png";
import GreenTv from "../../assets/GreenTv.png";
import GreenMicrowave from "../../assets/GreenMicrowave.png";
import GreenAirConditioner from "../../assets/GreenAirconditioner.png";

interface ProductProps {
  dark: boolean;
  options: number;
  isPc: boolean;
}

const ProductOptions: React.FC<ProductProps> = ({ options, isPc, dark }) => {
  const optionList = [
    "텔레비전",
    "침대",
    "전자레인지",
    "에어컨",
    "세탁기",
    "냉장고",
    "가스레인지",
  ];

  const iconList = [
    GreenTv,
    GreenBed,
    GreenMicrowave,
    GreenAirConditioner,
    GreenWashingMachine,
    GreenFridge,
    GreenStove,
  ];

  const numberArray: number[] = [0, 0, 0, 0, 0, 0, 0];

  // 편의시설 비트마스킹하는 함수
  const bitMaskDecode = (num: number) => {
    let val = num;
    numberArray.forEach((el, idx) => {
      if (val >= 2 ** (7 - idx)) {
        numberArray[idx] = 1;
        val -= 2 ** (7 - idx);
      }
    });
    return val;
  };
  bitMaskDecode(options);

  return (
    <div>
      <h1 className={isPc ? "hidden" : "text-2xl font-black"}>옵션</h1>
      <div className="flex flex-wrap justify-start items-center mt-5">
        {numberArray.map((el: any, idx: number) => {
          if (el) {
            return (
              <OptionIcon
                key={optionList[idx]}
                src={iconList[idx]}
                text={optionList[idx]}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};

export default ProductOptions;
