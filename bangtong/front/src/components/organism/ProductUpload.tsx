import axios from "axios";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useNavigate, useParams } from "react-router-dom";
import { formDataAxios } from "../../utils/authAxios";
import { getUserAddressNum } from "../../utils/services";

// 컴포넌트
import { CloseCircleOutlined } from "@ant-design/icons";
import { ConfigProvider, DatePicker, Form, Input, Radio } from "antd";
import useProductOptionStore from "../../store/productStore";
import Attachment from "../atoms/Attachment";
import Btn from "../atoms/Btn";
import InputBox from "../molecules/InputBox";
import OptionBtnGroup from "../molecules/OptionBtnGroup";

// 매물 업로드에 필요한 json의 인터페이스
interface ProductUploadDto {
  productType: string;
  regionId: string;
  productAddress: string;
  productDeposit: number;
  productRent: number;
  productMaintenance: number;
  productMaintenanceInfo: string;
  productIsRentSupportable: Boolean;
  productIsFurnitureSupportable: Boolean;
  productSquare: number;
  productRoom: number;
  productOption: number;
  productAdditionalOption: string[];
  productStartDate: string;
  productEndDate: string;
  productDetailAddress: string;
  lat: number;
  lng: number;
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

const ProductUpload: React.FC = () => {
  let { id }: any = useParams(); // 상품 번호. 있으면 update, 없으면 create

  // 옵션그룹을 상태관리하기 위한 store
  const { optionObj } = useProductOptionStore();

  const navigate = useNavigate();

  // 백엔드에 넘겨줄 데이터를 위한 state
  const [address, setAddress] = useState<string>("");
  const [addressDetail, setAddressDetail] = useState<string>("");
  const [regionId, setRegionId] = useState<string>("");
  const [deposit, setDeposit] = useState<string>("");
  const [charge, setCharge] = useState<string>("");
  const [maintanence, setMaintanence] = useState<string>("");
  const [maintanenceInfo, setMaintanenceInfo] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [typeRoom, setTypeRoom] = useState<string>("ONEROOM");
  const [room, setRoom] = useState<number>(0);
  const [furniture, setFurniture] = useState<string>("");
  const [furnitureList, setFurnitureList] = useState<string[]>([]);
  const [coordinate, setCoordinate] = useState<number[]>([]);
  const [date, setDate] = useState<[any, any]>([null, null]);

  // 사진 state
  const [imgFile, setImgFile] = useState<File[]>([]);
  const [fileNameList, setFileNameList] = useState<string[]>([]);

  // ant design Search 컴포넌트
  const { Search } = Input;

  // ant design RangePicker 컴포넌트
  const { RangePicker } = DatePicker;

  // ant design 글로벌 디자인 토큰
  const theme = {
    token: {
      colorBgTextHover: "#E9FFE7",
      colorPrimary: "#129B07",
      colorPrimaryBorder: "#129B07",
    },
  };

  // Datepicker를 위한 핸들러
  const handleValueChange = (newValue: any): void => {
    setDate(newValue);
  };

  // 수정일 시, 백엔드에서 값을 받아온 후 state에 집어넣음.
  if (id) {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/products/${id}`,
      headers: {},
    })
      .then((response) => {
        setAddress(response.data.data.productAddress); // 문자열 처리를 해줘서 상세주소 분리해서 setState
        setDeposit(response.data.data.productDeposit); // 보증금
        setCharge(response.data.data.productRent); // 월세
        setMaintanence(response.data.data.productMaintenence); //관리비
        setMaintanenceInfo(response.data.data.productMaintenenceInfo); // 관리비항목
        setArea(response.data.data.productSquare); // 방 면적
        setTypeRoom(response.data.data.type); // 방 면적
        setRoom(response.data.data.productRoom); // 방 개수
        setDate([
          response.data.data.productStartDate,
          response.data.data.productEndDate,
        ]);
        if (response.data.data.productAdditionalOption) {
          setFurnitureList(response.data.data.productAdditionalOption);
        }
      })
      .catch((err) => console.log(err));
  }

  // 주소검색 팝업 부분
  const open = useDaumPostcodePopup();

  const handleComplete = (data: any) => {
    setAddress(data.roadAddress);
    setRegionId(data.bcode);
  };

  // 주소검색 팝업 열기
  const handleAddressPopUp = () => {
    open({ onComplete: handleComplete });
  };

  // 방 유형 설정
  const handleTypeRoomOption = (e: any) => {
    setTypeRoom(() => e.target.value);
  };

  // 방 갯수 설정
  const handleRoomOption = (e: any) => {
    setRoom(() => e.target.value);
  };

  // 파일 등록 시 확장자 유효성판정 후 업로드
  const onFileChange = (e: any) => {
    const selectedFiles: any = Array.from(e.target.files);
    if (selectedFiles) {
      const extensionName = selectedFiles[0].name
        .split(".")
        .pop()
        .toLowerCase(); // 파일명에서 확장자명 추출
      if (["jpg", "png", "gif"].includes(extensionName)) {
        setImgFile((prevImages) => [...prevImages, ...selectedFiles]);
        setFileNameList((prev) => [...prev, selectedFiles[0].name]);
      } else {
        window.alert(
          "지원하지 않는 형식의 파일입니다\n*확장자가 jpg, png, gif인 파일만 등록 가능"
        );
      }
    }
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = (index: number) => {
    setImgFile((prevImages) => prevImages.filter((_, idx) => idx !== index));
    setFileNameList((prevList) => prevList.filter((_, idx) => idx !== index));
  };

  // 추가 옵션 등록 함수
  const handleFurnitureAppend = (e: any) => {
    if (e.key === "Enter" && furniture) {
      setFurnitureList(() => [...furnitureList, furniture]);
      setFurniture(() => "");
    }
  };

  // 추가 옵션에서 제외하는 함수
  const hadleFurnitureRemove = (val: string) => {
    setFurnitureList(() => furnitureList.filter((opt) => opt !== val));
  };

  // 매물 업로드 실행 함수
  const handleUploadClick = () => {
    // Option 처리 부분
    let option: number = 0;
    if (optionObj["풀옵션"]) {
      option = 255;
    } else {
      (Object.keys(optionObj) as (keyof typeof optionObj)[]).forEach(
        (opt, idx) => {
          optionObj[opt] ? (option += 2 ** (7 - idx)) : (option += 0);
        }
      );
    }

    const productUploadDto: ProductUploadDto = {
      productType: typeRoom, // 지금 값을 입력할 컴포넌트 없음
      productAddress: address,
      regionId, // daum postcode에서 나오는 bcode를 넣어줌.
      productDeposit: Number(deposit),
      productRent: Number(charge),
      productMaintenance: Number(maintanence),
      productMaintenanceInfo: maintanenceInfo,
      productIsRentSupportable: false,
      productIsFurnitureSupportable: furnitureList.length > 0,
      productSquare: Number(area),
      productRoom: Number(room),
      productOption: option,
      productAdditionalOption: furnitureList,
      productStartDate: dayjs(date[0]).format("YYYY-MM-DD"),
      productEndDate: dayjs(date[1]).format("YYYY-MM-DD"),
      productDetailAddress: addressDetail,
      lat: coordinate[1],
      lng: coordinate[0],
    };

    const formData = new FormData(); // formData 객체 생성
    const jsonBlob = new Blob([JSON.stringify(productUploadDto)], {
      type: "application/json",
    }); // blob으로 변환 후 타입 명시적으로 지정
    formData.append("productUploadDto", jsonBlob); // productUploadDto라는 key에 productUploadDto 반환

    // 이미지 업로드
    if (imgFile.length > 0) {
      imgFile.forEach((singleImg) => {
        formData.append(`productMedia`, singleImg);
      });
    }

    // 검증을 위한 부분
    let sendMethod = "POST";
    let sendUrl = `${process.env.REACT_APP_BACKEND_URL}/products/upload`;
    if (id) {
      sendMethod = "PUT";
      sendUrl = `${process.env.REACT_APP_BACKEND_URL}/modify/${id}`;
    }
    formDataAxios({
      method: sendMethod,
      url: sendUrl,
      data: formData,
    })
      .then((response) => {
        // 수정일 경우에는 id를, 생성일 경우에는 response data에서 오는 productId를 받아 매물 상세 페이지로 이동
        if (id) {
          navigate(`/products/${id}`);
        } else {
          navigate(`../`);
        }
      })
      .catch((err) => console.log(err));
  };

  // type이 number인 input에서 우측에 상하조절 화살표가 나오지 않게 하는 설정
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
        /* Chrome, Safari, Edge, Opera */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
  
        /* Firefox */
        input[type='number'] {
          -moz-appearance: textfield;
        }
      `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // 주소로 위경도 반환: CORS 에러 해결 필요
    if (address) {
      getUserAddressNum(address)
        .then((res) => {
          setCoordinate(res);
        })
        .catch((err) => console.log("위경도를 받아오지 못하고 있음!!!"));
    }
  }, [address]);

  return (
    <div className="mt-5 md:w-3/5 lg:w-2/5 mx-auto">
      <h2 className="font-bold text-xl">매물 정보를 입력해주세요.</h2>
      <ConfigProvider theme={theme}>
        <Form id="input-container" className="mt-5">
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            transition={{
              duration: 1.2,
              delay: 0.8,
              ease: [0, 0.7, 0.2, 1],
            }}
          >
            <Form.Item required>
              <Search
                placeholder="돋보기를 눌러 주소를 입력해 주세요"
                size="large"
                type="text"
                value={address}
                onSearch={handleAddressPopUp}
              />
            </Form.Item>
          </motion.div>
          {address ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0, 0.7, 0.2, 1],
              }}
            >
              <Form.Item required>
                <Input
                  placeholder="상세 주소를 입력해주세요"
                  size="large"
                  type="text"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                />
              </Form.Item>
            </motion.div>
          ) : null}

          {address ? (
            <motion.div
              className="mb-5"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0, 0.7, 0.2, 1],
              }}
            >
              <RangePicker
                size="large"
                className="w-full"
                placeholder={["승계 가능 일자", "계약 종료 일자"]}
                value={date}
                onCalendarChange={handleValueChange}
              />
            </motion.div>
          ) : null}

          {date[1] ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{
                duration: 3,
                delay: 1.5,
                ease: [0, 0.7, 0.2, 1],
              }}
            >
              <div className="w-full flex justify-between">
                <Form.Item required>
                  <Input
                    placeholder="보증금"
                    size="large"
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    suffix="만원"
                  />
                </Form.Item>
                <Form.Item required>
                  <Input
                    placeholder="월세"
                    size="large"
                    type="text"
                    value={charge}
                    onChange={(e) => setCharge(e.target.value)}
                    suffix="만원"
                  />
                </Form.Item>
              </div>
              <div className="w-full flex justify-between">
                <Form.Item required>
                  <Input
                    placeholder="관리비"
                    size="large"
                    type="text"
                    value={maintanence}
                    onChange={(e) => setMaintanence(e.target.value)}
                    suffix="만원"
                  />
                </Form.Item>
                <Form.Item required>
                  <Input
                    placeholder="관리비 항목"
                    size="large"
                    type="text"
                    className="w-60"
                    value={maintanenceInfo}
                    onChange={(e) => setMaintanenceInfo(e.target.value)}
                  />
                </Form.Item>
              </div>
              <div className="w-full flex justify-between">
                <Form.Item required>
                  <Input
                    placeholder="면적"
                    size="large"
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    suffix="m²"
                  />
                </Form.Item>
              </div>
            </motion.div>
          ) : null}
        </Form>
        {area.length > 1 ? (
          <motion.div
            className="mt-5"
            id="roomType"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.5,
              ease: [0, 0.7, 0.2, 1],
            }}
          >
            <p className="font-bold text-lg">주거 유형</p>
            <div className="flex justify-center items-center">
              <Radio.Group onChange={handleTypeRoomOption} value={typeRoom}>
                <Radio value={"ONEROOM"}>원룸</Radio>
                <Radio value={"TWOROOM"}>투룸+</Radio>
                <Radio value={"OFFICE"}>오피스텔</Radio>
                <Radio value={"VILLA"}>빌라</Radio>
                <Radio value={"APARTMENT"}>아파트</Radio>
              </Radio.Group>
            </div>
          </motion.div>
        ) : null}

        {area.length > 1 ? (
          <motion.div
            className="mt-5"
            id="how-many-room"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              delay: 1.5,
              ease: [0, 0.7, 0.2, 1],
            }}
          >
            <p className="font-bold text-lg">방 개수</p>
            <div className="flex justify-center items-center">
              <Radio.Group onChange={handleRoomOption} value={room}>
                <Radio value={1}>1</Radio>
                <Radio value={2}>2</Radio>
                <Radio value={3}>3개 이상</Radio>
              </Radio.Group>
            </div>
          </motion.div>
        ) : null}

        {room ? (
          <motion.div
            className="mt-5"
            id="options"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0, 0.7, 0.2, 1],
            }}
          >
            <p className="font-bold text-lg">옵션</p>
            <OptionBtnGroup />
            {/* 추가 옵션 부분 */}
            <div className="w-full mt-5">
              <div className="flex flex-wrap justify-center">
                {furnitureList.length > 0 ? (
                  <motion.div
                    className="flex justify-center mx-auto items-center text-center mt-5 w-full h-12 bg-yellow-200 rounded-lg"
                    initial={{ width: "0%" }} // 초기 상태에서 width가 0%
                    animate={{ width: "100%" }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut", // 애니메이션의 속도 곡선
                    }}
                  >
                    {furnitureList.map((opt: any) => {
                      return (
                        <motion.div
                          className={
                            "flex items-center border font-bold border-lime-500 rounded-lg m-1 px-3 py-1 text-lime-500 bg-lime-100"
                          }
                          key={opt}
                          initial={{ scale: 0 }} // 초기 상태에서 width가 0%
                          animate={{ scale: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.8,
                            ease: "easeOut", // 애니메이션의 속도 곡선
                          }}
                        >
                          {opt}
                          <CloseCircleOutlined
                            onClick={() => hadleFurnitureRemove(opt)}
                            className="cursor-pointer ms-3"
                          />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <p className="">등록된 가구가 없습니다.</p>
                )}
              </div>
              <div className="mt-2">
                {/* 희망 가구 옵션은 가구 icon을 버튼으로 만든 그룹을 컴포넌트로 만들어 활용 */}
                <InputBox
                  placeholder="희망하는 가구 거래 품목을 입력해주세요."
                  type="text"
                  width={"auto"}
                  value={furniture}
                  onChange={(e) => setFurniture(e.target.value)}
                  onKeyDown={(e) => handleFurnitureAppend(e)}
                />
              </div>
            </div>
            <div id="attachment-group">
              {imgFile.length ? (
                <div className="flex justify-center items-center text-center mt-5 w-full h-12 bg-lime-200 rounded-lg">
                  {fileNameList.map((el, index) => (
                    <button
                      key={index}
                      className={`mx-5 text-xs w-20 h-4/5 truncate border-2 border-yellow-200 rounded-md bg-yellow-100 hover:bg-yellow-300 transition-colors duration-200`}
                      onClick={() => handleRemoveImage(index)}
                    >
                      {el}
                    </button>
                  ))}
                </div>
              ) : null}

              <Attachment onFileChange={onFileChange} />
            </div>
            <div className="text-center mt-5">
              <Btn
                text="등록하기"
                backgroundColor="bg-yellow-300 hover:bg-yellow-400"
                height="h-10"
                onClick={handleUploadClick}
              />
            </div>
          </motion.div>
        ) : null}
      </ConfigProvider>
      <div className="h-24" />
    </div>
  );
};

export default ProductUpload;
