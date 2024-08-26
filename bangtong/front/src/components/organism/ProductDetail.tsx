import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../store/userStore";
import authAxios from "../../utils/authAxios";

// 컴포넌트
import ImgCarousel from "../molecules/ImgCarousel";
import Devider from "../atoms/Devider";
import ProductProfile from "../molecules/ProductProfile";
import ProductOptions from "../molecules/ProductOptions";
import ProductAdditionalOptions from "../molecules/ProductAdditionalOptions";
import LocationAround from "../molecules/LocationAround";
import ProductDetailInterest from "../molecules/ProductDetailInterest";
import Loading from "../atoms/Loading";
import {
  Button,
  Card,
  Carousel,
  Col,
  ConfigProvider,
  Modal,
  Row,
  Select,
} from "antd";

// 이미지 소스
import defaltHomeImg from "../../assets/defaulthome.png";
import defaultProfile from "../../assets/defaultprofile.jpg";
import {
  HeartOutlined,
  HeartFilled,
  DeleteOutlined,
  WechatOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { error } from "console";

interface RegionReturnDto {
  regionId: string;
  regionSido: string;
  regionGugun: string;
  regionDong: string;
  score: number;
}

interface ProductReturnDto {
  productId: number;
  productType: string;
  regionReturnDto: RegionReturnDto;
  productAddress: string;
  productDeposit: number;
  productRent: number;
  productMaintenance: number;
  productMaintenanceInfo: string;
  productIsRentSupportable: boolean;
  productIsFurnitureSupportable: boolean;
  productSquare: number;
  productRoom: number;
  productOption: number;
  productAdditionalOption: string[];
  productIsBanned: boolean;
  productIsDeleted: boolean;
  productPostDate: string;
  productStartDate: string;
  productEndDate: string;
  lat: number;
  lng: number;
  productAdditionalDetail: string;
  mediaList: string[];
}

interface ProfileDto {
  userId: number;
  profileImage: string;
  nickname: string;
}

interface ProductDetailI {
  productReturnDto: ProductReturnDto;
  profileDto: ProfileDto;
}

const ProductDetail: React.FC = () => {
  // 기본값 선언
  const tempObj: ProductDetailI = {
    productReturnDto: {
      productId: 1,
      productType: "ONEROOM",
      regionReturnDto: {
        regionId: "1111010900",
        regionSido: "서울특별시",
        regionGugun: "종로구",
        regionDong: "누상동",
        score: 0,
      },
      productAddress: "147-51",
      productDeposit: 10,
      productRent: 2000,
      productMaintenance: 5,
      productMaintenanceInfo: "수도세 포함, 전기세 미포함",
      productIsRentSupportable: true,
      productIsFurnitureSupportable: true,
      productSquare: 44.55,
      productRoom: 2,
      productOption: 84,
      productAdditionalOption: [],
      productIsBanned: false,
      productIsDeleted: false,
      productPostDate: "2024-07-19 04:01:15.256",
      productStartDate: "2024-08-01",
      productEndDate: "2024-12-30",
      lat: 37.5,
      lng: 127,
      productAdditionalDetail: "",
      mediaList: [""],
    },
    profileDto: {
      userId: 0,
      profileImage: "",
      nickname: "매콤한 호랑이143",
    },
  };
  let { id }: any = useParams(); // 상품 번호
  const navigate = useNavigate();
  const userId: number = useUserStore().id;

  // 신고 모달 상태관리
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // 로딩과 에러를 처리하는 state
  const [loading, setLoading] = useState(true);
  const [connectionFailed, setConnectionFailed] = useState(false);
  const [isInterest, setIsInterest] = useState(false);

  // state와 초기값 선언. 나중에 null, 0 혹은 빈 문자열로 바꿀거임.
  const [productInfo, setProductInfo] = useState(tempObj);

  // 글쓴이가 나인지 확인
  const [isMe, setIsMe] = useState<boolean>();

  // 1:1 채팅 아이콘 hover 처리
  const [hover, setHover] = useState<boolean>(false);

  const [dark, setDark] = useState(true);

  const reportRef = useRef<string>("");
  const reportTypeRef = useRef<number>(0);
  const changeModalStatus = () => {
    reportRef.current = "";
    setIsReportModalOpen(!isReportModalOpen);
  };

  // 백엔드에서 상세 페이지 정보 받아오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authAxios({
          method: "GET",
          url: `${process.env.REACT_APP_BACKEND_URL}/products/${id}`,
        });
        setProductInfo(response.data.data);
        setIsInterest(response.data.data.productReturnDto.productIsInterest);
        setIsMe(userId === response.data.data.profileDto.userId); // 유저 Id
        // 관심 매물 등록이 돼있는지 조회 후, 그렇다면 관심 상태를 true로
      } catch (err) {
        console.log(err);
        setConnectionFailed(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 매물 게시글 삭제 함수
  const handleDelete = (): void => {
    if (productInfo.profileDto.userId === userId) {
      authAxios({
        method: "DELETE",
        url: `${process.env.REACT_APP_BACKEND_URL}/products/delete/${id}`,
      })
        .then((response) => {
          navigate("/product"); // 삭제 후 페이지 이동
        })
        .catch((err) => console.log(err));
    }
  };

  // 관심 매물 등록(좋아요). 관심매물 좋아요 상태도 같이 보내줄 것.
  const handleInterestBtn = (): void => {
    let method: string = "POST";
    let url: string = `${process.env.REACT_APP_BACKEND_URL}/interests/add`;
    let data: any = { userId, productId: id };
    if (isInterest) {
      method = "DELETE";
      url = `${process.env.REACT_APP_BACKEND_URL}/interests/delete/${userId}/${id}`;
      data = {};
    }
    authAxios({ method, url, data })
      .then((response) => {
        setIsInterest(() => !isInterest); // 관심 매물 true/false 상태를 반전
      })
      .catch((err) => console.log(err));
  };

  // 채팅방 생성
  const makeChatRoom = () => {
    authAxios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/chatrooms/save`,
      data: {
        title: "끼얏호우",
        maker: productInfo.profileDto.userId,
        participant: userId,
        productId: productInfo.productReturnDto.productId,
      },
    })
      .then((response) => {
        navigate(`/chats/${response.data.data}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 일자를 파싱하는 함수
  const timeParser = (time: string): number[] => {
    if (!time) {
      return [0, 0, 0];
    }
    return time.split("-").map((el) => Number(el));
  };

  // modal ok 버튼 핸들러
  const handleModalOk = () => {
    setIsReportModalOpen(false);
  };

  // modal cancel 버튼 핸들러
  const handleModalCancel = () => {
    setIsReportModalOpen(false);
  };

  // ant design 글로벌 디자인 토큰
  const theme = {
    token: {
      colorBgTextHover: "#E9FFE7",
      colorPrimary: "#129B07",
      colorPrimaryBorder: "#129B07",
      defaultHoverBg: "#129B07",
    },
  };

  // 계약일, 계약종료일을 연월일로 반환
  const [startYear, startMonth, startDay] = timeParser(
    productInfo.productReturnDto.productStartDate
  );
  const [endYear, endMonth, endDay] = timeParser(
    productInfo.productReturnDto.productEndDate
  );

  const remainMonth = (endYear - startYear) * 12 + (endMonth - startMonth);

  // 비트마스킹된 기본옵션들 뽑아오기
  const options: number = productInfo.productReturnDto.productOption || 0;

  // 문자열 리스트로 들어오는 추가옵션 받아오기
  const additionalOption: string[] =
    productInfo.productReturnDto.productAdditionalOption || [];

  if (loading) return <Loading />;
  // if (connectionFailed) return <div>데이터를 불러오는 데 실패했습니다.</div>;

  const homeTypeNameTable: any = {
    ONEROOM: "원룸",
    TWOROOM: "투룸+",
    OFFICE: "오피스텔",
    VILLA: "빌라",
    APARTMENT: "아파트",
  };

  // 1:1 채팅 버튼 스타일
  const oneToOneButtonStyle = {
    backgroundColor: hover ? "#facc15" : "#fef08a",
    borderColor: hover ? "#facc15" : "",
    color: hover ? "#ffffff" : "",
  };

  const reportBoard = () => {
    if (reportTypeRef.current === 0) {
      alert("신고 유형을 선택해주세요.");
      return;
    }

    if (reportRef.current === "") {
      alert("사유를 입력해주세요.");
      return;
    }
    authAxios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/reports`,
      data: {
        reportSubjectTypeId: 0,
        reportTypeId: reportTypeRef.current,
        content: reportRef.current,
        subjectId: parseInt(id!!),
      },
    })
      .then((response) => {
        alert("신고가 완료되었습니다.");
        reportRef.current = "";
      })
      .catch((error) => {
        alert("로그인 후 이용하실 수 있습니다.");
      });
    changeModalStatus();
  };

  return (
    <>
      <div className="hidden md:block w-4/5 mx-auto">
        <div className="flex">
          <div>
            <Card style={{ width: 280 }} className="mb-5 shadow-lg">
              <Carousel arrows>
                {productInfo.productReturnDto.mediaList &&
                productInfo.productReturnDto.mediaList[0] ? (
                  productInfo.productReturnDto.mediaList.map((src: any) => (
                    <img
                      src={`${process.env.REACT_APP_BACKEND_SRC_URL}${src.mediaPath}`}
                      alt="집 이미지"
                      className="h-40"
                    />
                  ))
                ) : (
                  <img src={defaltHomeImg} />
                )}
              </Carousel>
              <h2 className="text-xl font-bold mt-5 ">
                보증금 {productInfo.productReturnDto.productDeposit}
                &nbsp;/&nbsp;월세&nbsp;
                {productInfo.productReturnDto.productRent}
              </h2>
              {/* 지역 표시 */}
              <p className="text-gray-400 mt-4">
                {productInfo.productReturnDto.regionReturnDto.regionSido}{" "}
                {productInfo.productReturnDto.regionReturnDto.regionGugun}{" "}
                {productInfo.productReturnDto.regionReturnDto.regionDong}{" "}
                {productInfo.productReturnDto.productAddress}
              </p>
              <div className="flex justify-between mt-4">
                <div className="flex">
                  {productInfo.productReturnDto.productIsRentSupportable ? (
                    <p className="w-auto p-2 font-bold text-black bg-lime-500 rounded-full text-center text-nowrap me-3">
                      월세지원
                    </p>
                  ) : (
                    ""
                  )}
                  {productInfo.productReturnDto
                    .productIsFurnitureSupportable ? (
                    <p className="w-auto p-2 font-bold text-black bg-yellow-300 rounded-full text-center text-nowrap">
                      가구도 승계
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <button onClick={handleInterestBtn} className="text-xl">
                  {isInterest ? (
                    <HeartFilled className="text-red-500" />
                  ) : (
                    <HeartOutlined />
                  )}
                </button>
              </div>
            </Card>
            <Card style={{ width: 280 }} className="mb-5 shadow-lg">
              <ProductDetailInterest
                productId={productInfo.productReturnDto.productId}
                chatOnClick={makeChatRoom}
                isMe={isMe}
              />
            </Card>
            <Card style={{ width: 280 }} className="mb-5 shadow-lg">
              <LocationAround
                lat={productInfo.productReturnDto.lng}
                lng={productInfo.productReturnDto.lat}
              />
            </Card>
          </div>
          <div className="ms-10 w-[800px]">
            <div>
              <ImgCarousel
                imgSrcArray={productInfo.productReturnDto.mediaList}
                productId={id}
                isCanClick={false}
                isFromBack
              />
            </div>
            <div className="flex justify-end items-center mt-5 text-2xl font-bold">
              {isMe ? (
                ""
              ) : (
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="border border-red-400 text-xl text-red-400 p-2 mr-auto rounded-xl hover:bg-red-400 hover:text-white"
                >
                  <AlertOutlined className="me-2" />
                  신고하기
                </button>
              )}
              <img
                src={
                  productInfo.profileDto.profileImage
                    ? `${process.env.REACT_APP_BACKEND_SRC_URL}${productInfo.profileDto.profileImage}`
                    : defaultProfile
                }
                alt="프로필 이미지"
                className="w-10 h-10 me-5 rounded-full"
              />
              <p className={isMe ? "me-2" : "me-5"}>
                {productInfo.profileDto.nickname}
              </p>
              {isMe ? (
                <span>(본인)</span>
              ) : (
                <ConfigProvider theme={theme}>
                  <Button
                    className={"bg-yellow-200 hover:bg-color-400"}
                    style={oneToOneButtonStyle}
                    size="large"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    icon={
                      <WechatOutlined
                        style={{ fontSize: "24px" }}
                        disabled={true}
                        type="primary"
                      />
                    }
                    onClick={makeChatRoom}
                  />
                </ConfigProvider>
              )}
            </div>
            <div className="p-10 pt-20 mt-10 rounded-2xl border border-slate-200">
              <Row>
                <Col span={12} className="text-2xl">
                  <span className="font-bold">관리비 | </span>
                  {productInfo.productReturnDto.productMaintenance} 원
                </Col>
                <Col span={12} className="text-2xl">
                  <span className="font-bold">집 유형 | </span>
                  {homeTypeNameTable[productInfo.productReturnDto.productType]}
                </Col>
              </Row>
              <Row className="mt-20">
                <Col span={12} className="text-2xl">
                  <span className="font-bold">관리비 포함 | </span>
                  {productInfo.productReturnDto.productMaintenanceInfo}
                </Col>
                <Col span={12} className="text-2xl">
                  <span className="font-bold">면적 | </span>
                  {productInfo.productReturnDto.productSquare} m² (
                  {Math.round(
                    0.3025 * productInfo.productReturnDto.productSquare
                  )}
                  평)
                </Col>
              </Row>
              <Row className="items-center mt-20">
                <Col span={24} className="text-2xl">
                  <span className="font-bold">방 개수 | </span>
                  {productInfo.productReturnDto.productRoom} 개
                </Col>
              </Row>
              <Row className="items-center mt-20">
                <Col span={24} className="text-2xl flex items-center">
                  <span className="font-bold">기본 옵션 | </span>
                  <ProductOptions options={options} isPc dark />
                </Col>
              </Row>
              <Row className="mt-20">
                <Col span={24} className="text-2xl">
                  <span className="font-bold">추가 옵션 | </span>
                  {productInfo.productReturnDto.productAdditionalOption.join(
                    ", "
                  )}
                </Col>
              </Row>
              {isMe ? (
                <div className="mt-5 text-end">
                  <button
                    className="w-12 h-12 bg-red-400 rounded-xl hover:bg-red-300 shadow-lg"
                    onClick={handleDelete}
                  >
                    <DeleteOutlined className="text-lg align-middle" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <div className="mt-10 w-full md:w-2/5 mx-auto">
          <ImgCarousel
            imgSrcArray={productInfo.productReturnDto.mediaList}
            isFromBack
            isCanClick={false}
          />
          <h2 className="text-2xl font-bold text-center">{`${productInfo.productReturnDto.regionReturnDto.regionSido} ${productInfo.productReturnDto.regionReturnDto.regionGugun} ${productInfo.productReturnDto.regionReturnDto.regionDong}`}</h2>
          <div className="w-full text-center my-5">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="bg-red-400 w-8 h-8 me-3 rounded-xl"
            >
              <AlertOutlined />
            </button>
            <Modal
              title="게시글 신고"
              open={isReportModalOpen}
              onOk={reportBoard}
              onCancel={changeModalStatus}
            >
              <div>
                <div>게시글 작성자: {productInfo?.profileDto.nickname}</div>
              </div>
              <Select
                defaultValue={"신고 유형"}
                className="w-full my-2"
                onChange={(e) => {
                  reportTypeRef.current = parseInt(e);
                }}
                options={[
                  { value: 1, label: "스팸/도배" },
                  { value: 2, label: "음란물" },
                  { value: 3, label: "유해한 내용" },
                  { value: 4, label: "비속어/차별적 표현" },
                  { value: 5, label: "개인정보 노출" },
                  { value: 6, label: "불쾌한 표현" },
                ]}
              />
              <span>신고 사유</span>
              <textarea
                className="w-full border resize-none"
                onChange={(e) => {
                  reportRef.current = e.target.value;
                }}
              />
            </Modal>
            <button
              onClick={handleInterestBtn}
              className={`w-8 h-8 border rounded-xl ${isInterest ? "border-red-300" : "border-black"}`}
            >
              {isInterest ? (
                <HeartFilled className="text-red-400" />
              ) : (
                <HeartOutlined />
              )}
            </button>
          </div>
          {/* 유저 프로필, 연락하기 */}
          <ProductProfile
            userinfo={productInfo.profileDto}
            productId={productInfo.productReturnDto.productId}
          />
          <Devider />
          <h2 className="text-2xl font-black">매물 설명 </h2>
          <p className="mt-2">
            {productInfo.productReturnDto.productAdditionalDetail
              ? productInfo.productReturnDto.productAdditionalDetail
              : "등록된 상세 설명이 없습니다"}
          </p>
          {/* 구분선 */}
          <Devider />
          {/* 기본정보 */}
          <div id="basicInformation">
            <h2 className="text-2xl font-black">기본정보</h2>
            <div className="mt-5">
              <div className="flex justify-between font-bold border-b-2 border-gray mb-2">
                <p>월세 / 보증금 (만)</p>
                <p>{`${productInfo.productReturnDto.productDeposit} / ${productInfo.productReturnDto.productRent}`}</p>
              </div>
              <div className="flex justify-between font-bold border-b-2 border-gray mb-2">
                <p>관리비 (만)</p>
                <p>{`${productInfo.productReturnDto.productMaintenance}`}</p>
              </div>
              <div className="flex justify-between font-bold border-b-2 border-gray mb-2">
                <p>승계 기간 (남은 계약기간)</p>
                <p>{`${remainMonth}개월`}</p>
              </div>
              <div className="flex justify-between font-bold border-b-2 border-gray mb-2">
                <p>입주 가능일</p>
                <p>{`${startYear}년 ${startMonth}월 ${startDay}일`}</p>
              </div>
              <div className="flex justify-between font-bold border-b-2 border-gray mb-2">
                <p>계약 종료일</p>
                <p>{`${endYear}년 ${endMonth}월 ${endDay}일`}</p>
              </div>
            </div>
          </div>
          {/* 구분선 */}
          <Devider />
          {/* 옵션 */}
          <ProductOptions options={options} isPc={false} dark />
          {/* 구분선 */}
          <Devider />
          {/* 추가옵션 */}
          <ProductAdditionalOptions
            additionalOptions={additionalOption as Array<string>}
          />
          {/* 구분선 */}
          <Devider />
          <LocationAround
            lat={productInfo.productReturnDto.lng}
            lng={productInfo.productReturnDto.lat}
          />
          <div className="h-20" />
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
