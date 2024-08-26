import React from "react";

// 컴포넌트
import ProfileMenu from "../molecules/ProfileMenu";
import { useParams } from "react-router-dom";

const ProfileMain: React.FC = () => {
  let { id } = useParams<{ id: string }>(); // 유저 번호

  // id가 undefined인 경우
  if (id === undefined) {
    return <p>잘못된 접근입니다.</p>;
  }

  return (
    <div className="w-full">
      <h2 className="w-full text-xl text-left mt-5 text-lime-500 font-bold">
        나의 거래
      </h2>
      <ProfileMenu />
    </div>
  );
};

export default ProfileMain;
