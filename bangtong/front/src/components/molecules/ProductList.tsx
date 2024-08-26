import React from "react";
import { useNavigate } from "react-router-dom";

// 데이터
import { productSearchStore } from "../../store/productStore";

// 컴포넌트
import { Card, Carousel } from "antd";

// 기본 방 이미지
import { HeartOutlined } from "@ant-design/icons";
import defaultRoomImg from "../../assets/defaulthome.png";

const ProductList: React.FC = () => {
  const { productsList } = productSearchStore();
  const navigate = useNavigate();

  return (
    <div
      id="product-list"
      className="bg-yellow-300 p-5 rounded-xl overflow-auto scroll-smooth"
      style={{ height: "840px" }}
    >
      {productsList.map((item) => (
        <Card
          style={{ width: 280 }}
          className="mb-5"
          hoverable
          onClick={() => navigate(`/products/${item.productId}`)}
        >
          <Carousel arrows>
            {item.mediaList.length !== 0 ? (
              item.mediaList.map((src: any) => (
                <img
                  src={`https://bangtong-bucket.s3.ap-northeast-2.amazonaws.com/${src.mediaPath}`}
                  alt="집 이미지"
                  className="h-40"
                />
              ))
            ) : (
              <img src={defaultRoomImg} />
            )}
          </Carousel>
          <h2 className="text-xl font-bold mt-5 ">
            보증금 {item.productDeposit}/월세 {item.productRent}
          </h2>
          <p className="text-gray-400 mt-4">
            {item.regionReturnDto.regionSido} {item.regionReturnDto.regionGugun}{" "}
            {item.regionReturnDto.regionDong} {item.productAddress}
          </p>
          <div className="flex justify-between mt-4">
            <div className="flex">
              {item.productIsRentSupportable ? (
                <p className="w-auto p-2 font-bold text-black bg-lime-500 rounded-full text-center text-nowrap me-3">
                  월세지원
                </p>
              ) : (
                ""
              )}
              {item.productIsRentSupportable ? (
                <p className="w-auto p-2 font-bold text-black bg-yellow-300 rounded-full text-center text-nowrap">
                  가구도 승계
                </p>
              ) : (
                ""
              )}
            </div>
            <HeartOutlined className="text-2xl" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;
