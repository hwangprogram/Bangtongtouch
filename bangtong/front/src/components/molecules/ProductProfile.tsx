import React, { useState } from "react";

// 컴포넌트
import { WechatOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import authAxios from "../../utils/authAxios";
import ProfileImgBox from "../atoms/ProfileImgBox";

// 이미지 소스

interface ProductProps {
  userinfo: any;
  productId: number;
}

// text="연락하기"
//         width="w-20"
//         textSize="text-sm"
//         backgroundColor="bg-yellow-300"

const ProductProfile: React.FC<ProductProps> = ({ userinfo, productId }) => {
  const [hover, setHover] = useState<boolean>(false);

  const navigate = useNavigate();

  const buttonStyle = {
    backgroundColor: hover ? "#facc15" : "#fef08a",
    borderColor: hover ? "#facc15" : "",
    color: hover ? "#ffffff" : "",
  };
  const { id } = useUserStore();

  const makeChatRoom = () => {
    authAxios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/chatrooms/save`,
      data: {
        title: "끼얏호우",
        maker: userinfo.userId,
        participant: id,
        productId,
      },
    })
      .then((response) => {
        navigate(`/chats/${response.data.data}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="flex justify-between items-center mt-5">
      <ProfileImgBox src={userinfo.profileImage} profileId={userinfo.id} />
      <div className="flex items-center">
        <h2 className="text-xl font-bold me-5">{userinfo.nickname}</h2>
        <Button
          className={"bg-yellow-200 hover:bg-color-400"}
          style={buttonStyle}
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
      </div>
    </div>
  );
};

export default ProductProfile;
