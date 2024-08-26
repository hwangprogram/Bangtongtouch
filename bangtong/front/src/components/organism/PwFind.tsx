import React from "react";

// 컴포넌트 불러오기
import TextBox from "../atoms/TextBox";
import InputBox from "../molecules/InputBox";
import Btn from "../atoms/Btn";

const PwFindPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="text-3xl font-bold m-6">
        <TextBox text="비밀번호 찾기" size="2xl" />
      </div>
      <div>
        <InputBox
          placeholder="아이디 (이메일)"
          buttonType="cancel"
          size="large"
          type="email"
          width={"70vw"}
        />
        <InputBox
          placeholder="핸드폰 번호"
          buttonType="cancel"
          size="large"
          type="email"
          width={"70vw"}
        />
        <div className="flex justify-center mt-10">
          <Btn
            text="인증하기"
            backgroundColor="bg-yellow-300"
            textColor="white"
          />
        </div>
      </div>
    </div>
  );
};

export default PwFindPage;
