import React, { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/layout/Layout";
import useUserStore from "./store/userStore";

// 유저 페이지 (로그인, 회원가입 등)
import UserPage from "./components/page/UserPage";
import Login from "./components/organism/Login"; // 로그인
import Signup from "./components/organism/Signup"; // 회원가입
import FindSelect from "./components/organism/FindSelect"; // 아이디, 비밀번호 찾기
// 메인
import MainPage from "./components/page/MainPage"; // 메인 페이지
// 매물
import ProductPage from "./components/page/ProductPage"; // 페이지
import ProductDetail from "./components/organism/ProductDetail"; // 매물 상세
import ProductUpload from "./components/organism/ProductUpload"; // 매물 업로드
import ProductChoicePage from "./components/page/ProductChoicePage";

// 채팅
import ChattingPage from "./components/page/ChattingPage"; // 페이지
import ChatMain from "./components/organism/ChatMain"; // 채팅 목록
import ChatDetail from "./components/organism/ChatDetail"; // 채팅창
// 마이방통
import ProfilePage from "./components/page/ProfilePage"; // 페이지
import ProfileMain from "./components/organism/ProfileMain"; // 나의 거래
import ProfileUpdate from "./components/organism/ProfileUpdate"; // 회원 정보 수정
import ProfilePwConfirm from "./components/molecules/ProfilePwConfirm"; // 비밀번호 확인
import ProfileEdit from "./components/molecules/ProfileEdit"; // 회원정보 수정
import ProfileNotification from "./components/organism/ProfilNotification"; // 알림 권한 설정
import ProductMapBox from "./components/organism/ProductMapBox";
import PreferenceList from "./components/organism/PreferenceList";
import PreferenceUpdate from "./components/organism/PreferenceUpdate";

// 커뮤니티
import CommunityPage from "./components/page/CommunityPage"; // 페이지
import CommunityMain from "./components/organism/CommunityMain"; // 커뮤니티 메인(목록)창
import CommunityDetail from "./components/organism/CommunityDetail"; // 글 상세
import CommunityCreate from "./components/organism/CommunityCreate"; // 글 쓰기
import authAxios from "./utils/authAxios";
import useAlarmInfoStore from "./store/alarmInfoStore";
import NotFoundPage from "./components/page/NotFoundPage";

// 비로그인시 보여줄 페이지
import InformationPage from "./components/page/InformationPage/InformationPage";
import ProductSearchPage from "./components/page/ProductSearchPage";
import VideoChat from "./components/atoms/VideoChat";

// 비로그인 사용자를 login으로 이동시키는 protectedRoute
const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useUserStore((state) => state.id);
  return isAuthenticated ? <Outlet /> : <Navigate to="/main" />;
};

const AppRoutes: React.FC = () => {
  const location = useLocation();

  // 페이지를 이동할 때마다 알람을 확인하는 로직 실행
  useEffect(() => {
    checkAlarm();
  }, [location]);

  const checkAlarm = () => {
    if (useUserStore.getState().token !== null) {
      authAxios({
        method: "GET",
        url: `${process.env.REACT_APP_BACKEND_URL}/alarms/${useUserStore.getState().id}/list`,
      })
        .then((response) => {
          useAlarmInfoStore
            .getState()
            .setAlarmUpdate(response.data.data.length, response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Routes>
      <Route path="main" element={<InformationPage />} />
      {/* 로그인, 회원가입, 아이디, 비밀번호 찾기 네비게이션바 X */}
      <Route path="user" element={<UserPage />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Signup />} />
        <Route path="FindSelectPage" element={<FindSelect />} />
      </Route>
      <Route path="search" element={<ProductSearchPage />} />
      {/* 네비게이션바가 있는 페이지의 최상단 */}
      <Route path="/" element={<Layout />}>
        {/* userStore에 id가 없으면 login으로 navigate 시키는 라우터 */}
        <Route element={<ProtectedRoute />}>
          {/* 메인 페이지 */}
          <Route path="" element={<MainPage />} />

          {/* 상품(매물) 페이지 */}
          <Route path="products" element={<ProductPage />}>
            <Route path="" element={<ProductMapBox />} />
            <Route path=":id" element={<ProductDetail />} />
            <Route path="category" element={<ProductChoicePage />} />
            <Route path="upload" element={<ProductUpload />} />
          </Route>

          {/* 채팅 페이지 */}
          <Route path="chats" element={<ChattingPage />}>
            <Route path="" element={<ChatMain />} />
            <Route path="videochat/:roomId" element={<VideoChat />} />
            <Route path=":roomId" element={<ChatDetail />} />
          </Route>

          {/* 마이페이지 */}
          <Route path="profile/:id" element={<ProfilePage />}>
            <Route path="preference" element={<PreferenceList />} />
            <Route path="" element={<ProfileMain />} />
            <Route
              path="preference/update/:prefId"
              element={<PreferenceUpdate />}
            />
            <Route path="update" element={<ProfileUpdate />}>
              <Route path="confirmed" element={<ProfileEdit />} />
              <Route path="" element={<ProfilePwConfirm />} />
            </Route>
            <Route path="notification" element={<ProfileNotification />} />
          </Route>
        </Route>
        {/* 커뮤니티 페이지 */}
        <Route path="boards" element={<CommunityPage />}>
          <Route path="" element={<CommunityMain />} />
          <Route path=":id" element={<CommunityDetail />} />
          <Route path="write" element={<CommunityCreate />} />
        </Route>
      </Route>

      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
