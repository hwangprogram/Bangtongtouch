import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, ConfigProvider } from "antd";

interface ProductProps {
  productId: number;
  chatOnClick?: Function;
  isMe?: boolean;
}

const ProductDetailInterest: React.FC<ProductProps> = ({
  productId,
  chatOnClick,
  isMe,
}) => {
  const [chatCnt, setChatCnt] = useState<number>();
  const [interestCnt, setInterestCnt] = useState<number>();

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/products/interest/${productId}`,
    })
      .then((res) => {
        setChatCnt(res.data.data.chatCnt);
        setInterestCnt(res.data.data.interestCnt);
      })
      .catch((err) => console.log(err));
  }, []);

  // ant design 글로벌 디자인 토큰
  const theme = {
    token: {
      colorBgTextHover: "#E9FFE7",
      colorPrimary: "#129B07",
      colorPrimaryBorder: "#129B07",
    },
  };

  return (
    <div className="text-base">
      <p>{interestCnt}명이 눈여겨 보고 있고,</p>
      <p>그 중 {chatCnt}명이 채팅을 보냈어요.</p>
      {isMe ? null : (
        <div className="text-center">
          <ConfigProvider theme={theme}>
            <Button
              size="large"
              className="mt-5 rounded-full"
              ghost
              type="primary"
              onClick={() => chatOnClick && chatOnClick()}
            >
              1:1 채팅하기
            </Button>
          </ConfigProvider>
        </div>
      )}
    </div>
  );
};

export default ProductDetailInterest;
