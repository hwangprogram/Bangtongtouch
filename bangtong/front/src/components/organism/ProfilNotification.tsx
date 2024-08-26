import React from "react";
import { Link, useParams } from "react-router-dom";

// 컴포넌트
import ToggleBox from "../molecules/ToggleBox";

const ProfileNotification: React.FC = () => {
  let { id } = useParams<{ id: string }>(); // 유저 번호

  // useEffect로 기본 state를 불러옴.

  return (
    <div>
      <div className="flex text-nowrap items-center mt-5">
        <h2 className="w-full text-xl text-left text-lime-500 font-bold">
          알림 권한 설정
        </h2>
        <Link
          to={`/profile/${id}`}
          className="bg-gray-400 py-1 px-4 rounded-full text-white"
        >
          메뉴로
        </Link>
      </div>
      <div className="border border-black px-5 pb-3 rounded-xl mt-5">
        <p className="text-lime-500 my-3">문자 알림</p>
        <ToggleBox text="채팅 새 메시지 알림" buttonId="alarmPhoneChat" />
        <ToggleBox
          text="관심 매물 승계 완료 알림"
          buttonId="alarmPhoneComplete"
        />
        <ToggleBox
          text="선호 검색 설정에 맞는 매물 등록 알림"
          buttonId="alarmPhoneInterest"
        />
        <p className="text-lime-500 my-3">이메일 알림</p>
        <ToggleBox text="채팅 새 메시지 알림" buttonId="alarmEmailChat" />
        <ToggleBox
          text="관심 매물 승계 완료 알림"
          buttonId="alarmEmailInterest"
        />
        <ToggleBox
          text="선호 검색 설정에 맞는 매물 등록 알림"
          buttonId="alarmEmailComplete"
        />
        <div className="text-center mt-5">
          <button className="bg-lime-500 text-white py-2 w-60 rounded-full">
            설정 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileNotification;
