import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchMap from "./SearchMap";
import { Button, ConfigProvider, Modal } from "antd";
import { FilterOutlined, UploadOutlined } from "@ant-design/icons";
import FilterBox from "./FilterBox";

interface Pos {
  lat: number;
  lng: number;
}

interface MapProps {
  height?: string;
}

const ProductMap: React.FC<MapProps> = ({ height }) => {
  const [positionLoaded, setPositionLoaded] = useState<boolean>(false);
  const [basePosition, setBasePosition] = useState<Pos>({ lat: 0, lng: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setBasePosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setPositionLoaded(true);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);

  // ant design 글로벌 디자인 토큰 (초록색 버튼)
  const greenTheme = {
    token: {
      colorBgTextHover: "#E9FFE7",
      colorPrimary: "#129B07",
      colorPrimaryBorder: "#129B07",
    },
  };

  // ant design 글로벌 디자인 토큰 (노란색 버튼)
  const yellowTheme = {
    token: {
      colorBgTextHover: "#000000",
      colorPrimary: "#FFDB4D",
      colorPrimaryBorder: "#000000",
      colorText: "#000000",
      colorTextHover: "#000000",
      colorTextLightSolid: "#000000",
    },
  };

  return (
    <div>
      {positionLoaded ? (
        <div>
          <div className="lg:hidden relative">
            <SearchMap
              basePos={basePosition}
              flag={false}
              width="350px"
              height="500px"
            />
            <ConfigProvider theme={greenTheme}>
              <Button
                type="primary"
                className="w-10 h-10 absolute bottom-5 right-5 shadow-lg"
                onClick={() => setIsModalOpen(true)}
              >
                <FilterOutlined />
              </Button>
              <Modal
                title="매물 필터"
                open={isModalOpen}
                footer=""
                width={350}
                onCancel={() => setIsModalOpen(false)}
                className="flex justify-center"
              >
                <FilterBox />
              </Modal>
            </ConfigProvider>
            <ConfigProvider theme={yellowTheme}>
              <Button
                type="primary"
                className="w-40 h-10 absolute left-24 bottom-5 shadow-lg"
                onClick={() => navigate("upload")}
              >
                <UploadOutlined />
                매물 업로드하기
              </Button>
            </ConfigProvider>
          </div>
          <div className="hidden lg:block relative">
            <SearchMap basePos={basePosition} flag={false} height="800px" />
            <ConfigProvider theme={yellowTheme}>
              <Button
                type="primary"
                className="w-40 h-10 absolute right-5 bottom-5 shadow-lg text-black"
                onClick={() => navigate("upload")}
              >
                <UploadOutlined />
                매물 업로드하기
              </Button>
            </ConfigProvider>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductMap;
