import React, { useEffect, useState } from "react";
import { useUserPreferStore } from "../../store/userStore";
import authAxios from "../../utils/authAxios";

// 컴포넌트
import { Carousel, ConfigProvider } from "antd";
import { useNavigate } from "react-router-dom";
import Loading from "../atoms/Loading";
import TextBox from "../atoms/TextBox";
import CarouselBox from "../organism/CarouselBox";

import "../../index.css";

const MainPage: React.FC = () => {
  const [products, setProducts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHover, setIsHover] = useState<boolean>(false);
  const navigate = useNavigate();

  const { preferenceId } = useUserPreferStore();

  useEffect(() => {
    setIsLoading(true);
    if (preferenceId !== 0) {
      authAxios({
        method: "GET",
        url: `${process.env.REACT_APP_BACKEND_URL}/products/preference/${preferenceId}`,
      })
        .then((res) => {
          setProducts(res.data.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full md:w-3/6 bg-white dark:bg-gray-800 text-black dark:text-white">
          <div className="md:hidden">
            <TextBox
              text="방통터치 메인"
              color="lime-500"
              size="3xl"
              weight="bold"
            />
          </div>
          <CarouselBox />
          <ConfigProvider
            theme={{
              components: {
                Carousel: {
                  arrowSize: 30,
                },
              },
            }}
          >
            <Carousel arrows autoplay draggable dots={false}>
              {products.length > 0 ? (
                products.map((product: any) => (
                  <div className="relative">
                    <img
                      src={
                        process.env.REACT_APP_BACKEND_SRC_URL +
                        product.mediaList[0].mediaPath
                      }
                      alt="매물 사진"
                      className="hover:cursor-pointer object-fill w-full h-[350px] hover:brightness-50"
                      onClick={() => navigate(`products/${product.productId}`)}
                      onMouseEnter={() => setIsHover(true)}
                      onMouseLeave={() => setIsHover(false)}
                    />
                    <div
                      className={
                        isHover
                          ? "absolute w-full bottom-0 left-0 text-gray-100 text-3xl font-bold mb-5 px-5"
                          : "hidden"
                      }
                    >
                      <div>
                        <p className="text-4xl font-bold text-lime-300">
                          {product.productDeposit} / {product.productRent}
                        </p>
                        <p>
                          면적: {product.productSquare}m² (
                          {Math.round(product.productSquare * 0.3025)}평)
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-[350px] bg-gray-50 flex content-center">
                  <p className="text-center my-auto text-xl font-bold">
                    등록된 매물이 없습니다.
                  </p>
                </div>
              )}
            </Carousel>
          </ConfigProvider>

          <div className="h-24" />
        </div>
      )}
    </>
  );
};

export default MainPage;
