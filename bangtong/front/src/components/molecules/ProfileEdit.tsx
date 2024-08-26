import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import authAxios from "../../utils/authAxios";
import { motion } from "framer-motion";

// 컴포넌트
import { ConfigProvider, Input, Form } from "antd";
// 컴포넌트

// ant design 글로벌 디자인 토큰
const theme = {
  token: {
    colorBgTextHover: "#E9FFE7",
    colorPrimary: "#129B07",
    colorPrimaryBorder: "#129B07",
  },
};

const ProfileEdit: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [pwSecond, setPwSecond] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const { id, email } = useUserStore();
  const navigate = useNavigate();

  const handleUserInfoUpdate = (e: any) => {
    e.preventDefault();
    if (password !== pwSecond) {
      window.alert("두 비밀번호가 일치하지 않습니다.");
      return;
    }
    const sendData = {
      email,
      password,
      phone,
    };

    authAxios({
      method: "PUT",
      url: `${process.env.REACT_APP_BACKEND_URL}/users/modify/${id}`,
      data: sendData,
    })
      .then(() => navigate(`/profile/${id}`))
      .catch((err) => console.log(err));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0,
        ease: [0, 0.7, 0.2, 1],
      }}
      className="border border-black p-10 rounded-xl mt-5"
    >
      <ConfigProvider>
        <Form.Item
          name="비밀번호 확인"
          rules={[
            { required: false, message: "휴대폰번호를 입력해주세요." },
            { type: "string", message: "" },
          ]}
          hasFeedback
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.5,
              ease: [0, 0.7, 0.2, 1],
            }}
          >
            <Input.Password
              placeholder="새 비밀번호"
              allowClear
              className="rounded-full"
              size="large"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </motion.div>
        </Form.Item>

        <Form.Item
          name="비밀번호 확인"
          rules={[
            { required: false, message: "휴대폰번호를 입력해주세요." },
            { type: "string", message: "" },
          ]}
          hasFeedback
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 1,
              ease: [0, 0.7, 0.2, 1],
            }}
          >
            <Input.Password
              placeholder="비밀번호 확인"
              allowClear
              className="rounded-full"
              size="large"
              value={pwSecond}
              onChange={(e) => setPwSecond(e.target.value)}
            />
          </motion.div>
        </Form.Item>

        <Form.Item
          name="휴대폰 번호"
          rules={[
            { required: false, message: "휴대폰번호를 입력해주세요." },
            { min: 11, max: 11, message: "휴대폰 번호는 11자리 입니다." },
            { type: "string", message: "" },
          ]}
          hasFeedback
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 1.5,
              ease: [0, 0.7, 0.2, 1],
            }}
          >
            <Input
              placeholder="휴대폰 번호 (- 제외)"
              className="rounded-full border-2"
              size="large"
              allowClear
              minLength={11}
              maxLength={11}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </motion.div>
        </Form.Item>
        <motion.div className="text-center mt-3">
          <button
            className="bg-lime-500 text-white py-2 w-60 rounded-full"
            onClick={handleUserInfoUpdate}
          >
            수정 완료
          </button>
        </motion.div>
      </ConfigProvider>
    </motion.div>
  );
};

export default ProfileEdit;
