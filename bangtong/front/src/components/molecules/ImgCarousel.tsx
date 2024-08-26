import { Carousel, ConfigProvider } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import defaultHome from "../../assets/defaulthome.png";

import "../../index.css";

interface imgSrcProps {
  //imgCarousel props 로 이미지 src 배열 전달
  imgSrcArray?: Array<string>; //전달 안했을 경우 디폴트 이미지로
  productId?: string; // 디테일페이지로 이동하기위한 PK
  isCanClick?: boolean; // 캐러셀 클릭 가능여부
  isForChat?: boolean; // 채팅창에 나타낼 캐러셀인지
  isFromBack?: boolean; // 백단에서 온 데이터인지
}

const ImgCarousel: React.FC<imgSrcProps> = ({
  imgSrcArray = [""],
  productId,
  isCanClick = true,
  isForChat = false,
  isFromBack = false,
}) => {
  const imgSrc: Array<string> = [];
  const navigate = useNavigate();

  if (imgSrcArray && imgSrcArray[0]) {
    imgSrcArray.forEach((element) => {
      imgSrc.push(element);
    });
  } else {
    imgSrc.push(defaultHome);
  }

  // 이미지에 보이는 매물로 이동하기
  const handleImgClick = () => {
    navigate(`products/${productId}`);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Carousel: {
            arrowOffset: 20,
            arrowSize: 20,
          },
        },
      }}
    >
      <Carousel arrows autoplay draggable adaptiveHeight>
        {imgSrc.map((img: any) => {
          return (
            <div
              key={img}
              onClick={isCanClick ? handleImgClick : undefined}
              className={`${isCanClick ? "hover:cursor-pointer" : ""}`}
            >
              <img
                key={img}
                src={
                  isFromBack
                    ? process.env.REACT_APP_BACKEND_SRC_URL + img.mediaPath
                    : img
                }
                alt="1"
                className="rounded-xl h-60 md:h-80 w-full"
              />
            </div>
          );
        })}
      </Carousel>
    </ConfigProvider>
  );
};

export default ImgCarousel;
