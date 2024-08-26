import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import authAxios from "../../utils/authAxios";

// 컴포넌트
import { ConfigProvider, Modal } from "antd";
import { productSearchStore } from "../../store/productStore";
import { useUserPreferStore } from "../../store/userStore";
import TextBtn from "../atoms/TextBtn";
import BtnGroup from "../molecules/BtnGroup";

// 이모티콘
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { MapPinIcon } from "@heroicons/react/20/solid";
import { getUserAddressKr2, getUserAddressNum2 } from "../../utils/services";

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

const FilterBox: React.FC = () => {
  const [locationTitle, setLocationTitle] = useState<string>("");
  const [open, setOpen] = useState(false); // 지역 선택 모달
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [regions, setRegions] = useState([]); // 지역 선택 모달에 뜰 버튼들 갱신
  const [isShakeSearch, setIsShakeSearch] = useState<boolean>(false); // 검색 버튼 애니메이션 상태
  const [isShakeReset, setIsShakeReset] = useState<boolean>(false); // 검색 버튼 애니메이션 상태

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
    productsList,
    setDeposit,
    setRent,
    setHomeType,
    setInfra,
    setDate,
    setProductsList,
    setAddress,
    setInitailize,
  } = productSearchStore();

  const {
    preferenceId,
    regionAddress,
    preferenceName,
    preferenceDeposit,
    preferenceRent,
    preferenceType,
    preferenceInfra,
    preferenceStartDate,
    preferenceEndDate,
    setPreferUpdate,
  } = useUserPreferStore();

  const type: Array<string> = [
    "ONEROOM",
    "TWOROOM",
    "OFFICE",
    "VILLA",
    "APARTMENT",
  ];

  // 설정된 선호 설정이 있을 시(preferenceStore의 데이터), 이 값들을 searchStore의 각 항목들에 넣어준다
  useEffect(() => {
    setInitailize();
    if (preferenceId) {
      setLocationTitle(regionAddress);
      setAddress(regionAddress);
      setDeposit(0, preferenceDeposit);
      setRent(0, preferenceRent);
      setHomeType(preferenceType.indexOf("1"));
      for (let idx = 0; idx < preferenceInfra.length; idx++) {
        if (preferenceInfra[idx] === "1") {
          setInfra(idx);
        }
      }
      setDate(preferenceStartDate, preferenceEndDate);
    }
  }, [preferenceId]);

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
      .catch((err) => console.log(err));
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
  const handleSearch = async () => {
    setIsShakeSearch(true);
    setTimeout(() => setIsShakeSearch(false), 1000); // 애니메이션 지속 시간과 동일하게
    const searchData = {
      order,
      minDeposit,
      maxDeposit,
      minRent,
      maxRent,
      type: roomTypeConverter(homeType),
      regionId: address,
      rentSupportable,
      furnitureSupportable,
      infra: bitMaskingInfra(infra),
      startDate,
      endDate,
      address: undefined,
    };

    if (
      searchData.regionId === "" ||
      searchData.type === undefined ||
      searchData.type === null
    ) {
      if (searchData.regionId === "") alert("지역을 선택해 주세요.");
      else alert("집 유형을 선택해 주세요.");
    } else {
      await getUserAddressNum2(locationTitle).then((res1) => {
        getUserAddressKr2(res1[0], res1[1]).then((res2) => {
          authAxios({
            method: "POST",
            url: `${process.env.REACT_APP_BACKEND_URL}/products/search`,
            data: {
              order,
              minDeposit,
              maxDeposit,
              minRent,
              maxRent,
              type: type[
                homeType[1] * 1 +
                  homeType[2] * 2 +
                  homeType[3] * 3 +
                  homeType[4] * 4
              ],
              regionId: parseInt(res2),
              rentSupportable,
              furnitureSupportable,
              infra: 0,
              startDate: "2024-08-13",
              endDate: "2024-08-30",
              lat: res2[0],
              lng: res2[1],
            },
          })
            .then((response) => {
              if (
                response.data.data === null ||
                response.data.data.length === 0
              ) {
                alert("검색 조건과 일치하는 매물이 없습니다.");
              } else {
                setProductsList(response.data.data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    }
  };

  const handleSearchInitialize = () => {
    setIsShakeReset(true);
    setInitailize();
    setLocationTitle("");
    setTimeout(() => setIsShakeSearch(false), 1000); // 애니메이션 지속 시간과 동일하게
  };

  return (
    <div className="w-80 px-5 py-10 border-2 rounded-xl shadow-md">
      {preferenceId ? (
        <p className="text-lg mb-3">
          현재 선호 검색 조건:
          <span className="font-bold text-lime-600 text-lg ms-3">
            {preferenceName}
          </span>{" "}
        </p>
      ) : null}
      <button
        className="w-full bg-lime-500 tracking-wider font-semibold text-white p-2 rounded-xl"
        onClick={showRegionModal}
      >
        {locationTitle ? (
          locationTitle
        ) : (
          <div className="w-full flex items-center justify-center">
            <MapPinIcon width={20} className="me-3" />
            <p>지역을 선택해 주세요.</p>
          </div>
        )}
      </button>
      <ConfigProvider theme={theme}>
        <Modal
          title="지역을 선택해 주세요."
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <div className="p-2 text-center dark:bg-gray-800">
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
      <TextBtn title="보증금" text={`${minDeposit}만 ~ ${maxDeposit}만`} />
      <TextBtn
        title="월세 (관리비 포함)"
        text={`${minRent}만 ~ ${maxRent}만`}
      />
      <BtnGroup title="집 유형" itemsArray={homeCategory} />
      <BtnGroup title="편의시설" itemsArray={facilities} />
      <BtnGroup title="지원 여부" itemsArray={["월세 지원", "가구도 승계"]} />
      <div className="text-end mr-2">
        <motion.button
          className={`mt-5 p-2 bg-red-400 w-14 h-14 rounded-xl text-2xl text-center text-black shadow-lg hover:scale-110 transition-colors hover:bg-red-300 duration-200`}
          onClick={handleSearchInitialize}
          animate={isShakeReset ? { y: [0, -5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 1 }}
        >
          <UndoOutlined className="my-auto mx-auto" />
        </motion.button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <motion.button
          className="mt-5 p-2 bg-lime-500 w-14 h-14 rounded-xl text-2xl text-center text-white shadow-lg hover:scale-110 transition-colors hover:bg-lime-300 duration-200"
          onClick={handleSearch}
          animate={isShakeSearch ? { y: [0, -5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 1 }}
        >
          <SearchOutlined className="my-auto mx-auto" />
        </motion.button>
      </div>
    </div>
  );
};

export default FilterBox;
