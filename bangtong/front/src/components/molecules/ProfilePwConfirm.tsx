import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import authAxios from "../../utils/authAxios";

// 컴포넌트
import { ConfigProvider, Input } from "antd";

const ProfilePwConfirm: React.FC = () => {
  const { id } = useUserStore();
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");

  // ant design 글로벌 디자인 토큰
  const theme = {
    token: {
      colorBgTextHover: "#E9FFE7",
      colorPrimary: "#129B07",
      colorPrimaryBorder: "#129B07",
    },
  };

  // 비밀번호를 이용해 유효한 유저인지 판별하는 함수
  const handlePwVerify = (e: any) => {
    e.preventDefault();
    authAxios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/users/password`,
      data: {
        userId: id,
        password,
      },
    })
      .then((response) => {
        if (response.data.data) {
          navigate(`/profile/${id}/update/confirmed`);
        } else {
          alert("비밀번호 검증에 실패했습니다.");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <form className="mt-10">
      <p className="mb-5 text-gray-500 dark:text-white">비밀번호 확인</p>
      <ConfigProvider theme={theme}>
        <Input.Password
          placeholder="비밀번호"
          allowClear
          className="rounded-full"
          size="large"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </ConfigProvider>
      <div className="text-end">
        <button
          className="bg-lime-500 py-1 px-4 mt-5 rounded-full text-white"
          onClick={handlePwVerify}
        >
          확인
        </button>
      </div>
    </form>
  );
};

export default ProfilePwConfirm;
