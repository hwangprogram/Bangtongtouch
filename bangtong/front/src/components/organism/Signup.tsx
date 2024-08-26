import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";

// 컴포넌트 불러오기
import TextBox from "../atoms/TextBox";
import { Form, Input, ConfigProvider, Button } from "antd";

// 아이콘
import { LoadingOutlined } from "@ant-design/icons";

// 닉네임 생성용 배열 만들기
const animalArr = [
  "생쥐",
  "송아지",
  "호랑이",
  "토끼",
  "용용이",
  "구렁이",
  "망아지",
  "양양이",
  "원숭이",
  "병아리",
  "댕댕이",
  "도야지",
];
const adjectiveArr = [
  "귀여운",
  "구슬픈",
  "활기찬",
  "활발한",
  "침착한",
  "냉정한",
  "피곤한",
  "신난",
  "멍한",
  "맹렬한",
];

const SignupPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [socialNumber, setSocialNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [certificationNumber, setCertificationNumber] = useState("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVerification, setPasswordVerification] = useState<string>("");
  const [page, setPage] = useState(0); // 페이지 넘기기 위한 변수
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const { setInfoUpdate, setToken } = useUserStore();

  // 랜덤 양의 정수 생성함수
  const randInt = (max: number): number => {
    return Math.floor(Math.random() * max);
  };

  // 닉네임 자동생성 함수
  const nickNameCreate = (): string => {
    return (
      adjectiveArr[randInt(10)] + animalArr[randInt(12)] + String(randInt(1000))
    );
  };

  // 회원가입 직후 로그인함수
  const handleLogInAfterSignUp = (): void => {
    const payload = {
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
        navigate("/search"); // 첫 선호 옵션 생성 페이지로 이동
      })
      .catch((error) => console.log("전송 실패", error));
  };

  // 일반 회원가입 함수
  const handleSignUp = (e: any): void => {
    if (password !== passwordVerification) {
      window.alert("입력하신 비밀번호가 다릅니다.");
      return;
    }
    // 주민번호를 기반으로 출생년도와 성별을 산출
    let birthYear: number = Number(socialNumber.slice(0, 2)) + 1900;
    // 2000년 이후 주민 앞자리의 경우
    if ([3, 4, 7, 8].includes(Number(socialNumber[6]))) {
      birthYear += 100;
    }

    // 성별은 주민번호 뒷자리 첫 자를 숫자로 변환 후 2로 나눈 나머지를 반환
    const gender: number = Number(socialNumber[6]) % 2;
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/users/register`,
      data: {
        username: email,
        email: email,
        name: name,
        password: password,
        birthYear: birthYear,
        gender: gender,
        nickname: nickNameCreate(),
      },
    })
      .then(() => {
        handleLogInAfterSignUp(); // 회원가입 직후 로그인
      })
      .catch((err) => console.log(err));
  };

  // 이메일 인증 요청 함수
  const handleMailSend = () => {
    // 발송된 이메일이 없는 메일 혹은 존재하는 사용자이면 status 400번대 response
    setIsLoading(true);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/emails`,
      data: {
        email,
      },
    })
      .then((response) => {
        alert("해당 이메일로 인증번호가 전송됐습니다.");
        setIsLoading(false);
        setPage(page + 1);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        alert(
          "인증번호 전송에 실패했습니다. 입력한 메일을 다시 한 번 확인해주세요."
        );
      });
  };

  // 메일 인증번호 확인 handler
  const handleCertificateConfirm = (e: any) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/emails/verify`,
      data: {
        email,
        code: certificationNumber,
      },
    })
      .then((response) => {
        if (response.data.data) {
          setPage(page + 1);
        } else {
          alert(
            "이메일 인증에 실패했습니다. 인증번호를 다시 한 번 확인해주세요."
          );
        }
      })
      .catch((err) => {
        console.log(err);
        alert(
          "이메일 인증에 실패했습니다. 인증번호를 다시 한 번 확인해주세요."
        );
      });
  };

  // type이 number인 input에서 우측에 상하조절 화살표가 나오지 않게 하는 설정
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      /* Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Firefox */
      input[type='number'] {
        -moz-appearance: textfield;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // ant design 글로벌 디자인 토큰
  const theme = {
    token: {
      colorBgTextHover: "#E9FFE7",
      colorPrimary: "#129B07",
      colorPrimaryBorder: "#129B07",
      colorLinkHover: "#6EF962",
    },
  };

  const handleNext = async () => {
    try {
      await form.validateFields();
      setPage(page + 1);
    } catch (error) {
      console.log("유효성 검사 실패:", error);
    }
  };

  return (
    <div id="signup-block">
      <div className="text-3xl text-center font-bold m-6">
        <TextBox text="회원가입" size="2xl" />
      </div>
      <ConfigProvider theme={theme}>
        <Form form={form}>
          {page > 5 ? (
            // 비밀번호 확인 input
            <Form.Item
              name="비밀번호 확인"
              dependencies={["비밀번호"]}
              rules={[{ required: true, message: "비밀번호를 입력해주세요" }]}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                <Input.Password
                  placeholder="비밀번호 확인"
                  className="rounded-full border-2"
                  size="large"
                  allowClear
                  disabled={page !== 6}
                  onChange={(e) => setPasswordVerification(e.target.value)}
                />
              </motion.div>
            </Form.Item>
          ) : null}

          {page > 4 ? (
            // 비밀번호 input
            <Form.Item
              name="비밀번호"
              rules={[{ required: true, message: "비밀번호를 입력해주세요" }]}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                <Input.Password
                  placeholder="비밀번호"
                  className="rounded-full border-2"
                  size="large"
                  allowClear
                  disabled={page !== 5}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </motion.div>
            </Form.Item>
          ) : null}

          {page > 3 ? (
            // 이메일 인증번호 input
            <Form.Item
              name="이메일 인증"
              rules={[{ required: true, message: "이메일 인증이 필요합니다." }]}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                <Input
                  placeholder="이메일 인증번호"
                  className="rounded-full border-2"
                  size="large"
                  allowClear
                  disabled={page !== 4}
                  onChange={(e) => setCertificationNumber(e.target.value)}
                  onPressEnter={handleCertificateConfirm}
                />
              </motion.div>
            </Form.Item>
          ) : null}

          {page > 2 ? (
            // 이메일 입력 input
            <Form.Item
              name="이메일"
              rules={[
                { required: true, message: "이메일을 입력해주세요." },
                {
                  type: "email",
                  message: "올바른 이메일을 입력해주세요.",
                },
              ]}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                <Input
                  placeholder="이메일"
                  className="rounded-full border-2 me-1"
                  size="large"
                  allowClear
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={page !== 3}
                  onPressEnter={handleMailSend}
                  suffix={isLoading ? <LoadingOutlined /> : null}
                />
              </motion.div>
            </Form.Item>
          ) : null}
          {page > 1 ? (
            // 휴대폰 번호 input
            <Form.Item
              name="휴대폰 번호"
              rules={[
                { required: true, message: "휴대폰번호를 입력해주세요." },
                { min: 11, max: 11, message: "휴대폰 번호는 11자리 입니다." },
                { type: "string", message: "" },
              ]}
              hasFeedback
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                <Input
                  placeholder="휴대폰 번호 (- 제외)"
                  className="rounded-full border-2"
                  size="large"
                  allowClear
                  minLength={11}
                  maxLength={11}
                  disabled={page !== 2}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </motion.div>
            </Form.Item>
          ) : null}
          {page > 0 ? (
            // 주민번호 및 뒷자리 1자 입력
            <Form.Item
              name="주민등록번호"
              rules={[
                { required: true, message: "주민등록번호를 입력해주세요." },
                { min: 7, max: 7, message: "앞 6자리 + 뒤 1자리" },
                {
                  type: "string",
                  message: "",
                },
              ]}
              hasFeedback
              initialValue={socialNumber}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
                className="flex"
              >
                <Input
                  placeholder="주민번호 (- 제외)"
                  className="rounded-full border-2"
                  size="large"
                  allowClear
                  value={socialNumber}
                  disabled={page !== 1}
                  maxLength={7}
                  onChange={(e) => setSocialNumber(e.target.value)}
                />
              </motion.div>
            </Form.Item>
          ) : null}
          {page >= 0 ? (
            // 실명 입력 input
            <Form.Item
              name="이름"
              rules={[
                { required: true, message: "이름을 입력해주세요." },
                { type: "string" },
              ]}
              hasFeedback
              initialValue={name}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                <Input
                  placeholder="이름"
                  className="rounded-full border-2"
                  size="large"
                  allowClear
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={page !== 0}
                />
              </motion.div>
            </Form.Item>
          ) : null}
          <div className="text-center">
            <Button
              type="primary"
              className="py-6 px-10 rounded-full text-lg"
              onClick={
                page === 6
                  ? handleSignUp
                  : page === 3
                    ? handleMailSend
                    : page === 4
                      ? handleCertificateConfirm
                      : handleNext
              }
              htmlType="submit"
            >
              {page === 6 ? "회원가입" : "다음"}
            </Button>
          </div>
        </Form>
        <div className="text-lime-500 text-sm md:text-base mt-3 text-center">
          <Link to={"/user/login"}>로그인 화면으로</Link>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default SignupPage;
