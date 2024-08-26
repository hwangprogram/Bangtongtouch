import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";

const ProfileUpdate: React.FC = () => {
  let { id } = useParams<{ id: string }>(); // 유저 번호

  return (
    <div>
      <div className="w-full flex text-nowrap items-center mt-5">
        <h2 className="text-xl text-left text-lime-500 font-bold">
          회원 정보 수정
        </h2>
        <Link
          to={`/profile/${id}`}
          className="bg-gray-400 ml-auto py-1 px-4 rounded-full text-white"
        >
          메뉴로
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default ProfileUpdate;
