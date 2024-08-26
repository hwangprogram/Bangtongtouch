import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useUserStore, { useUserPreferStore } from "../../store/userStore";

// 컴포넌트 불러오기
import { Button, ConfigProvider, Form, Input } from "antd";
import IconBtn from "../atoms/IconBtn";
import TextBox from "../atoms/TextBox";

// 이미지 소스
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Google from "../../assets/GoogleSocial.png";
import Kakao from "../../assets/KakaoSocial.png";
import Naver from "../../assets/NaverSocial.png";
import authAxios from "../../utils/authAxios";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token, setInfoUpdate, setToken } = useUserStore(); // store
  const { setPreferUpdate } = useUserPreferStore();
  const navigate = useNavigate();
  const [errorCount, setErrorCount] = useState(0);
  const [form] = Form.useForm(); // antd

  interface LoginInfo {
    username: string;
    password: string;
  }

  // ant design 글로벌 디자인 토큰
  const theme = {
    token: {
      colorBgTextHover: "#E9FFE7",
      colorPrimary: "#129B07",
      colorPrimaryBorder: "#129B07",
      colorLinkHover: "#6EF962",
    },
  };

  // 소셜 로그인
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const code = searchParams.get("code");
  const stateCode = searchParams.get("state");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);

  if (stateCode === "1234") {
    const formData: FormData = new FormData();
    formData.append("grant_type", "code");
    formData.append("client_id", process.env.REACT_APP_CLIENT_ID_NAVER + "");
    formData.append(
      "client_secret",
      process.env.REACT_APP_CLIENT_SECRET_NAVER + ""
    );
    formData.append("code", code + "");
    formData.append("state", stateCode);
    axios({
      method: "POST",
      url: "https://nid.naver.com/oauth2.0/token",
      data: formData,
    })
      .then((response) => {})
      .catch((error) => console.log("전송 실패", error));
  }

  // 일반 로그인함수
  const handleLogIn = (e: any): void => {
    e.preventDefault();
    if (email === "") {
      alert("이메일을 입력해주세요");
      return;
    }
    if (password === "") {
      alert("비밀번호를 입력해주세요");
      return;
    }
    const payload: LoginInfo = {
      username: email,
      password: password,
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/users/login`,
      data: payload,
    })
      .then((response) => {
        const infoObj = response.data.data;
        infoObj.email = email; // 본인이 입력한 이메일 추가
        setInfoUpdate(infoObj);
        setToken(response.headers.authorization);
        authAxios({
          method: "GET",
          url: `${process.env.REACT_APP_BACKEND_URL}/preferences/${response.data.data.id}/list`,
        })
          .then((response) => {
            setPreferUpdate(response.data.data[0]);
            navigate("../../");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch(() => setErrorCount((state) => state + 1));
  };

  // 네이버 로그인 함수
  const handleNaverLogin = () => {
    const clientId = process.env.REACT_APP_CLIENT_ID_NAVER;
    const redirectUri = encodeURIComponent(
      process.env.REACT_APP_CALLBACK_URL_NAVER + ""
    );
    const state = "1234";
    const naverLoginUri = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}`;
    // navigate(naverLoginUri);
    window.open(naverLoginUri, "_blank", "width=600,height=600");
  };

  // 구글 로그인 함수
  const handleGoogleLogin = () => {
    const clientId = process.env.REACT_APP_CLIENT_ID_GOOGLE;
    const redirectUri = encodeURIComponent(
      process.env.REACT_APP_CALLBACK_URL_GOOGLE + ""
    );
    const googleLoginUri = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email`;
    // navigate(googleLoginUri);
    window.open(googleLoginUri, "_blank", "width=600,height=600");
  };

  // 카카오 로그인 함수
  const handleKakaotalkLogin = () => {
    const clientId = process.env.REACT_APP_CLIENT_ID_KAKAOTALK;
    const redirectUri = encodeURIComponent(
      process.env.REACT_APP_CALLBACK_URL_KAKAOTALK + ""
    );
    const kakaotalkLoginUri = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=profile_nickname profile_image`;
    // navigate(kakaotalkLoginUri);
    window.open(kakaotalkLoginUri, "_blank", "width=600,height=600");
  };
  return (
    <>
      <div className="font-bold m-6 text-center">
        <TextBox text="로그인" size="2xl" />
      </div>
      <ConfigProvider theme={theme}>
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            name="이메일 (아이디)"
            rules={[
              { required: true, message: "" },
              { type: "email", warningOnly: true, message: "" },
              { type: "string" },
            ]}
            hasFeedback
            style={{ marginBottom: "8px" }}
          >
            <Input
              placeholder="이메일 (아이디)"
              className="rounded-full border-2"
              size="large"
              allowClear
              prefix={<UserOutlined />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="비밀번호"
            rules={[{ required: true, message: "" }]}
            style={{ marginBottom: "8px" }}
            hasFeedback
          >
            <Input.Password
              placeholder="비밀번호"
              className="rounded-full border-2"
              size="large"
              allowClear
              prefix={<LockOutlined />}
              value={password}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogIn(e);
                }
              }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <div className="flex justify-between text-sm md:text-base text-lime-500">
            <Link to="/user/FindSelectPage">아이디/비밀번호 찾기</Link>
            <Link to="/user/register">회원가입</Link>
          </div>
          <div className="flex justify-center mt-3">
            <div className="mx-2">
              <IconBtn imgSrc={Google} size={40} onClick={handleGoogleLogin} />
            </div>
            <div className="mx-2">
              <IconBtn
                imgSrc={Kakao}
                size={40}
                onClick={handleKakaotalkLogin}
              />
            </div>
            <div className="mx-2">
              <IconBtn imgSrc={Naver} size={40} onClick={handleNaverLogin} />
            </div>
          </div>
          {errorCount ? (
            <motion.div
              className="flex justify-center mt-8 rounded-md items-center mx-auto bg-red-300 w-full h-16 shadow-md text-center"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              transition={{
                duration: 0.5,
                delay: 0.5,
                ease: "easeOut",
              }}
            >
              <motion.span
                className="font-bold text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 1.1,
                  ease: "easeOut",
                }}
              >{`입력 정보가 올바르지 않습니다 (${errorCount}회 오류).`}</motion.span>
            </motion.div>
          ) : null}
          <div className="flex justify-center mt-8">
            <Button
              type="primary"
              onClick={handleLogIn}
              className="py-6 px-10 rounded-full text-lg"
            >
              로그인
            </Button>
          </div>
        </Form>
      </ConfigProvider>
    </>
  );
};

export default LoginPage;
