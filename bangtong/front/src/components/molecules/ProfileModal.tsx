import React, { useEffect, useState } from "react";
import useUserStore, { useUserPreferStore } from "../../store/userStore";
import { motion } from "framer-motion";

// 아이콘
import {
  CheckOutlined,
  CalendarOutlined,
  EditOutlined,
  CloseSquareFilled,
} from "@ant-design/icons";
import { MapPinIcon } from "@heroicons/react/20/solid";

import authAxios from "../../utils/authAxios";

// 컴포넌트
import TextBtn from "../atoms/TextBtn";
import BtnGroup from "../molecules/BtnGroup";
import Modal from "react-modal";
import {
  Button,
  Input,
  ConfigProvider,
  DatePicker,
  Popover,
  Modal as AntModal,
} from "antd";
import { productSearchStore, preferenceStore } from "../../store/productStore";

// modal 상속값을 정의하는 인터페이스. 수정일 경우 selectedId가 있고, 작성일 경우에는 없다.
interface ModalI {
  modalIsOpen: boolean;
  selectedId?: number;
  closeModal: () => void;
  addpreferenceArr: (rslt: any) => void;
  className: string;
}

const ProfileModal: React.FC<ModalI> = ({
  modalIsOpen,
  selectedId,
  closeModal,
  addpreferenceArr,
  className,
}) => {
  const customStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const { id } = useUserStore();
  const { setPreferUpdate } = useUserPreferStore();

  // 모달창에 뜨기 위한 state
  const [preferenceName, setPreferenceName] = useState<string>("");

  // 지역설정 부분
  const [locationTitle, setLocationTitle] = useState<string>("");
  const [open, setOpen] = useState(false); // 지역 선택 모달
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [regions, setRegions] = useState([]); // 지역 선택 모달에 뜰 버튼들 갱신
  const [regionId, setRegionId] = useState<string>("");

  const {
    maxDeposit,
    maxRent,
    homeType,
    infra,
    address,
    startDate,
    endDate,
    setDeposit,
    setRent,
    setHomeType,
    setAddress,
    setInfra,
    setDate,
    setInitailize,
  } = productSearchStore();

  const { setPreference } = preferenceStore();

  const { RangePicker } = DatePicker;

  // 변경된 날짜 set
  const handleChange = (dates: any) => {
    setDate(dates[0], dates[1]);
  };

  // 날자 입력을 위한 설정
  const datePicker = (
    <RangePicker
      className="w-full"
      placeholder={["입주 일자", "퇴거 일자"]}
      onChange={handleChange}
    />
  );

  // 영어 type(변환해야함.)
  const homeCategoryEnglish: string[] = [
    "ONEROOM",
    "OFFICE",
    "TWOROOM",
    "VILLA",
    "APARTMENT",
  ];

  // 문자열로 된 infra 정보로 store의 infra 배열을 변화시키는 함수
  const infraSetter = (char: string): void => {
    for (let i = 0; i < char.length; i++) {
      if (char[i] === "1") {
        setInfra(i);
      }
    }
  };

  // 배열을 문자열로 전환하는 함수
  const infraStringfier = (inputArr: number[]): string => {
    const arr: string[] = [];
    inputArr.forEach((el) => arr.push(String(el)));
    return arr.join("");
  };

  // 선호 옵션을 선택할 때마다(selectedId가 변경될 때마다) 다른 전송 후 모달에서 해당 ID의 선호 옵션을 띄워줌
  useEffect(() => {
    setInitailize(); // 일단 productSearchStore의 값들을 초기화

    // 조회 및 수정이라면(selectedId가 있다면) 불러오기, 아니면(selectedId가 없다면) 빈 form을 보여주기
    if (selectedId) {
      authAxios({
        method: "GET",
        url: `${process.env.REACT_APP_BACKEND_URL}/preferences/${selectedId}`,
      })
        .then((response) => {
          const result = response.data.data;
          setRegionId(result.regionId);
          setPreferenceName(result.preferenceName);
          setDeposit(0, result.preferenceDeposit);
          setRent(0, result.preferenceRent);
          setLocationTitle(result.regionAddress);
          setHomeType(
            homeCategoryEnglish.findIndex((el) => el === result.preferenceType)
          );
          infraSetter(result.preferenceInfra); // 반복문을 돌면서 infra 배열을 바꿔줌
          setDate(result.preferenceStartDate, result.preferenceEndDate);
          const regionId = result.regionId;
          // regionId를 보내서 주소 상세를 받아온다.
          authAxios({
            method: "GET",
            url: `${process.env.REACT_APP_BACKEND_URL}/preferences/${regionId}`,
          })
            .then((res) => {
              // 받아온 상세 주소를 조립해 표시될 상세 주소를 변경한다.
              const newLocationTitle =
                res.data.data.region.regionSido +
                " " +
                res.data.data.region.regionDong +
                " " +
                res.data.data.region.regionGun;
              setLocationTitle(newLocationTitle);
            })
            .catch((err) => console.log(err));
        })

        .catch((err) => console.log(err));
    }
  }, [selectedId]);

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
    setRegionId(regionId);
    setAddress(locationTitle);
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

  // 방 타입을 반환하는 함수
  const roomTypeConverter = (numArr: number[]): string => {
    const tempArr: string[] = [];
    numArr.forEach((el) => tempArr.push(String(el)));
    return tempArr.join("");
  };

  // 선호 설정 수정
  const handleUpdate = (): void => {
    const stDate = new Date(startDate).getTime();
    const edDate = new Date(endDate).getTime();
    const dataSet = {
      preferenceName: preferenceName,
      regionAddress: locationTitle,
      preferenceRegionAddress: address,
      preferenceDeposit: maxDeposit,
      preferenceRent: maxRent,
      preferenceType: roomTypeConverter(homeType),
      preferenceInfra: infraStringfier(infra),
      preferenceStartDate: stDate,
      preferenceEndDate: edDate,
    };
    authAxios({
      method: "PUT",
      url: `${process.env.REACT_APP_BACKEND_URL}/preferences/modify/${selectedId}`,
      data: dataSet,
    })
      .then((response) => {
        closeModal();
      })
      .catch((err) => {
        window.alert("변경 사항이 반영되지 않았습니다.");
      });
  };

  // 선호설정 적용
  const handleApplicate = () => {
    const dataSet = {
      preferenceId: selectedId,
      preferenceName: preferenceName,
      regionAddress: locationTitle,
      preferenceDeposit: maxDeposit,
      preferenceRent: maxRent,
      preferenceType: roomTypeConverter(homeType),
      preferenceInfra: infraStringfier(infra),
      preferenceStartDate: startDate,
      preferenceEndDate: endDate,
    };
    setPreferUpdate(dataSet); // productSearchStore의 데이터를 이용해서 현재 선호설정 변경
    closeModal();
  };

  // 선호 설정 생성
  const handleCreate = (): void => {
    const stDate = new Date(startDate).getTime();
    const edDate = new Date(endDate).getTime();
    const dataSet = {
      preferenceName: preferenceName,
      regionAddress: locationTitle,
      preferenceRegionAddress: address,
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
        const rslt = response.data.data;
        addpreferenceArr(rslt);
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        window.alert("변경 사항이 반영되지 않았습니다.");
      });
  };

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        style={customStyle}
        onRequestClose={closeModal}
        contentLabel="선택된 선호 조건"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0, 0.5, 0.2, 1],
          }}
        >
          <div className="w-80 relative px-5 py-10 border-2 rounded-xl shadow-md max-h-[80vh] overflow-y-auto dark:bg-gray-800">
            {/* 모달의 x버튼 */}
            <div
              className="absolute top-1 right-1 hover:cursor-pointer"
              onClick={closeModal}
            >
              <CloseSquareFilled
                width={40}
                style={{ color: "red", fontSize: "24px" }}
              />
            </div>
            {selectedId ? (
              <h1 className="text-lime-500 text-center font-bold ml-3 text-xl">
                {preferenceName}
              </h1>
            ) : (
              <Input
                placeholder="설정 이름을 입력하세요"
                size="large"
                type="text"
                value={preferenceName}
                onChange={(e) => setPreferenceName(e.target.value)}
              />
            )}

            <hr className="border-2" />
            <br />
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
              <AntModal
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
                            handleGugunClick(
                              region.regionId,
                              region.regionGugun
                            );
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
              </AntModal>
            </ConfigProvider>
            <TextBtn title="보증금" text={`~${maxDeposit}만`} />
            <TextBtn title="월세" text={`~${maxRent}만`} />
            <br />
            <div className="flex">
              <p className="text-center text-lime-600 font-bold">
                날짜{" "}
                <span className="text-sm">
                  {startDate.slice(2)} ~ {endDate.slice(2)}
                </span>
              </p>
              <Popover
                trigger="click"
                placement="bottom"
                title={
                  <p className="text-center mb-3">
                    희망 주거기간을 설정해주세요.
                  </p>
                }
                content={datePicker}
              >
                <Button
                  type="text"
                  size="large"
                  icon={<CalendarOutlined className="text-lime-500" />}
                ></Button>
              </Popover>
            </div>

            <BtnGroup title="집 유형" itemsArray={homeCategory} />
            <BtnGroup title="편의시설" itemsArray={facilities} />
            <div className="text-end mr-2">
              {selectedId ? (
                <>
                  <button
                    className="mt-5 p-2 bg-yellow-500 w-14 h-14 rounded-xl text-2xl text-center text-white shadow-lg"
                    onClick={handleUpdate}
                  >
                    <EditOutlined className="my-auto mx-auto" />
                  </button>
                  <button
                    className="mt-5 p-2 bg-lime-500 w-14 h-14 rounded-xl text-2xl text-center text-white shadow-lg"
                    onClick={handleApplicate}
                  >
                    <CheckOutlined className="my-auto mx-auto" />
                  </button>
                </>
              ) : (
                <button
                  className="mt-5 p-2 bg-lime-500 w-14 h-14 rounded-xl text-2xl text-center text-white shadow-lg"
                  onClick={handleCreate}
                >
                  <CheckOutlined className="my-auto mx-auto" />
                </button>
              )}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
        </motion.div>
      </Modal>
    </>
  );
};
export default ProfileModal;
