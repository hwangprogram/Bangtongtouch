import React from "react";
import { useNavigate } from "react-router-dom";
import authAxios from "../../utils/authAxios";
import useUserStore, { useUserPreferStore } from "../../store/userStore";
import { productSearchStore } from "../../store/productStore";

import BtnGroup from "../molecules/BtnGroup";
import ProductSearchButton from "../atoms/ProductSearchButton";
import TextBtn from "../atoms/TextBtn";

interface IProductSearch3Props {
  onPrev: () => void;
}

// type
const homeCategory: string[] = ["원룸", "투룸+", "오피스텔", "빌라", "아파트"];

// 영어 type(변환해야함.)
const homeCategoryEnglish: string[] = [
  "ONEROOM",
  "OFFICE",
  "TWOROOM",
  "VILLA",
  "APARTMENT",
];

// infra
const facilities: string[] = [
  "경찰서",
  "마트",
  "버스 정류장",
  "병원/약국",
  "지하철 역",
  "카페",
  "코인 세탁소",
  "편의점",
];

const ProductSearch3: React.FC<IProductSearch3Props> = ({ onPrev }) => {
  const navigate = useNavigate();
  const { id } = useUserStore();
  const { setPreferUpdate } = useUserPreferStore();

  const { maxDeposit, maxRent, homeType, infra, address, startDate, endDate } =
    productSearchStore();

  // 배열을 문자열로 전환하는 함수
  const infraStringfier = (inputArr: number[]): string => {
    const arr: string[] = [];
    inputArr.forEach((el) => arr.push(String(el)));
    return arr.join("");
  };

  // 방 타입을 반환하는 함수
  const roomTypeConverter = (numArr: number[]): string => {
    const tempArr: string[] = [];
    numArr.forEach((el) => tempArr.push(String(el)));
    return tempArr.join("");
  };

  // 선호 설정 생성
  const handleCreate = (): void => {
    const stDate = new Date(startDate).getTime();
    const edDate = new Date(endDate).getTime();
    const dataSet = {
      preferenceName: "첫 선호 설정",
      regionAddress: address,
      preferenceDeposit: maxDeposit,
      preferenceRent: maxRent,
      preferenceType: roomTypeConverter(homeType),
      preferenceInfra: infraStringfier(infra),
      preferenceStartDate: stDate,
      preferenceEndDate: edDate,
    };
    authAxios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/preferences/add/${id}`,
      data: dataSet,
    })
      .then((response) => {
        authAxios({
          method: "GET",
          url: `${process.env.REACT_APP_BACKEND_URL}/preferences/${id}/list`,
        })
          .then((response) => {
            setPreferUpdate(response.data.data[0]); // 기본 선호 설정을 첫번째 선호 설정으로 변경
            navigate(`/`); // 메인 화면으로 이동
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        window.alert("변경 사항이 반영되지 않았습니다.");
      });
  };

  return (
    <div className="text-center">
      <h2 className={"text-xl mb-8"}>3. 맞춤 검색 조건을 설정해 주세요.</h2>

      <div className={"mb-8"}>
        <TextBtn title="보증금" text={`~${maxDeposit}만`} />
        <TextBtn title="월세 (관리비 포함)" text={`~${maxRent}만`} />
        <BtnGroup title="집 유형" itemsArray={homeCategory} />
        <BtnGroup title="편의시설" itemsArray={facilities} />
      </div>

      <ProductSearchButton
        color={"text-yellow-color"}
        borderColor={"border-yellow-color"}
        text={"이전"}
        hoverBackgroundColor={"bg-green-color"}
        hoverColor={"text-white"}
        onClick={onPrev}
      />

      <ProductSearchButton
        color={"text-green-color"}
        borderColor={"border-green-color"}
        text={"완료"}
        hoverBackgroundColor={"bg-green-color"}
        hoverColor={"text-white"}
        onClick={handleCreate}
      />
    </div>
  );
};

export default ProductSearch3;
