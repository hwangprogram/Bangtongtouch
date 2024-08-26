import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";

// 컴포넌트
import ProfileBox from "../molecules/ProfileBox";

// Store
import useUserStore from "../../store/userStore";

const ProfilePage: React.FC = () => {
  let urlId: string | undefined = useParams().id; // 접근하려는 user의 profile 페이지
  const { id, nickname } = useUserStore(); // 유저 번호
  const location = useLocation();

  // id가 undefined 혹은 다른 유저로의 접근인 경우
  if (id === undefined || id !== Number(urlId)) {
    return (
      <>
        <p>잘못된 접근입니다.</p> <br />
        <Link to={"/"} className="text-lime-500">
          --메인으로 돌아가기--
        </Link>
      </>
    );
  }

  return (
    <div className="w-full md:w-2/5">
      {id ? (
        <div>
          {/* 프로필 메인페이지에서만 프로필 편집 창이 뜨도록 주소 비교 */}
          {location.pathname === `/profile/${id}` ? <ProfileBox /> : <></>}
          <Outlet />
        </div>
      ) : (
        <div>
          <h1 className="text-2xl md:text-3xl text-red-500 text-center font-bold my-40">
            로그인 후 이용가능합니다.
          </h1>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
