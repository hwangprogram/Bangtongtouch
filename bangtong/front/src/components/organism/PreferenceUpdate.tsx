import React, { useState } from "react";
import axios from "axios";
import authAxios from "../../utils/authAxios";

// 컴포넌트
import TextBtn from "../atoms/TextBtn";
import BtnGroup from "../molecules/BtnGroup";
import { ConfigProvider, Modal } from "antd";
import { productSearchStore } from "../../store/productStore";

// 이모티콘
import { SearchOutlined } from "@ant-design/icons";
import { MapPinIcon } from "@heroicons/react/20/solid";

const PreferenceUpdate: React.FC = () => {
  const [locationTitle, setLocationTitle] = useState<string>("");
  const [open, setOpen] = useState(false); // 지역 선택 모달
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [regions, setRegions] = useState([]); // 지역 선택 모달에 뜰 버튼들 갱신

  const {
    order,
    minDeposit,
    maxDeposit,
    minRent,
    maxRent,
    homeType,
    infra,
    address,
    rentSupportable,
    furnitureSupportable,
    startDate,
    endDate,
    setProductsList,
    setAddress,
  } = productSearchStore();

  // 지역 설정 모달 오픈 핸들러
  const showRegionModal = () => {
    setOpen(true);

    // 광역시 및 도 단위 지역 요청
    authAxios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/regions`,
    })
      .then((res) => {
        setRegions(res.data.data);
      })
      .catch((e) => console.log(`지역을 못받아옴. ${e}`));
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setLocationTitle("");
    setOpen(false);
  };

  // 광역지자체 단위 버튼을 눌렀을 시
  const handleSidoClick = (regionId: string, regionSido: string) => {
    setLocationTitle(() => regionSido);
    // 지역설정 모달에 기초지자체 단위를 띄움
    authAxios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/regions/${regionId}`,
    })
      .then((res) => {
        setRegions(res.data.data);
      })
      .catch((err) => console.log(`지역을 못받아옴. ${err}`));
  };

  // 기초지자체 단위 버튼을 눌렀을 시
  const handleGugunClick = (regionId: string, regionGugun: string) => {
    setLocationTitle(() => locationTitle + " " + regionGugun);
    // 읍면동 단위 버튼을 받아온다.
    authAxios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/regions/gugun/${regionId}`,
    })
      .then((res) => {
        setRegions(res.data.data);
      })
      .catch((err) => console.log(`지역을 못받아옴. ${err}`));
  };

  // 읍면동 단위 버튼을 눌렀을 시
  const handleDongClick = (regionId: string, regionDong: any) => {
    setLocationTitle(() => locationTitle + " " + regionDong);
    setAddress(regionId);
    setOpen(false); // 모달 닫기
  };

  // type
  const homeCategory: string[] = [
    "원룸",
    "투룸+",
    "오피스텔",
    "빌라",
    "아파트",
  ];

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

  // ant design 글로벌 디자인 토큰
  const theme = {
    token: {
      colorBgTextHover: "#E9FFE7",
      colorPrimary: "#129B07",
      colorPrimaryBorder: "#129B07",
    },
  };

  // 편의시설 비트마스킹하는 함수
  const bitMaskingInfra = (numArr: number[]): number => {
    let val = 0;
    numArr.forEach((el, idx) => {
      if (el) {
        val += 2 ** (7 - idx);
      }
    });
    return val;
  };

  // 방 타입을 반환하는 함수
  const roomTypeConverter = (numArr: number[]) =>
    homeCategoryEnglish[numArr.findIndex((el) => el)]; // 1인 index(0이 아닌 index) 반환

  // 검색을 진행하는 함수
  const handleSearch = () => {
    const searchData = {
      order,
      minDeposit,
      maxDeposit,
      minRent,
      maxRent,
      type: roomTypeConverter(homeType),
      address,
      rentSupportable,
      furnitureSupportable,
      infra: bitMaskingInfra(infra),
      startDate,
      endDate,
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/products/search`,
      data: searchData,
    })
      .then((response) => {
        setProductsList(response.data.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-80 px-5 py-10 border border-2 rounded-xl shadow-md">
      <button
        className="w-full bg-lime-500 text-white p-2 rounded-full"
        onClick={showRegionModal}
      >
        {locationTitle ? (
          locationTitle
        ) : (
          <div className="w-full flex items-center justify-center">
            <MapPinIcon width={20} className="me-3" />
            <p>지역을 선택해주세요.</p>
          </div>
        )}
      </button>
      <ConfigProvider theme={theme}>
        <Modal
          title="지역을 선택해주세요."
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <div className="p-2 text-center">
            {regions.map(
              (region: {
                regionId: string;
                regionSido?: string;
                regionGugun?: string;
                regionDong?: string;
              }) => (
                <button
                  key={region.regionId}
                  className={`p-2 border rounded-full m-1 border-gray-400 text-gray-400 hover:border-lime-500 hover:text-lime-500
                  `}
                  onClick={() => {
                    if (region.regionSido) {
                      handleSidoClick(region.regionId, region.regionSido);
                    } else if (region.regionGugun) {
                      handleGugunClick(region.regionId, region.regionGugun);
                    } else {
                      handleDongClick(region.regionId, region.regionDong);
                    }
                  }}
                >
                  {region.regionSido
                    ? region.regionSido
                    : region.regionGugun
                      ? region.regionGugun
                      : region.regionDong}
                </button>
              )
            )}
          </div>
        </Modal>
      </ConfigProvider>

      <TextBtn title="보증금" text={`${minDeposit}만~${maxDeposit}만`} />
      <TextBtn title="월세 (관리비 포함)" text={`${minRent}만~${maxRent}만`} />
      <BtnGroup title="집 유형" itemsArray={homeCategory} />
      <BtnGroup title="편의시설" itemsArray={facilities} />
      <BtnGroup title="지원 여부" itemsArray={["월세 지원", "가구도 승계"]} />
      <div className="text-end mr-2">
        <button
          className="mt-5 p-2 bg-lime-500 w-14 h-14 rounded-xl text-2xl text-center text-white shadow-lg"
          onClick={handleSearch}
        >
          <SearchOutlined className="my-auto mx-auto" />
        </button>
      </div>
    </div>
  );
};

export default PreferenceUpdate;
