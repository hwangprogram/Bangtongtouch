import React, { useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import authAxios from "../../utils/authAxios";

// 컴포넌트 불러오기
import { Dropdown, FloatButton, Badge } from "antd";
import Btn from "../atoms/Btn";

// 이미지 소스
import Logo from "../../assets/GreenLogo.png";

// Store
import useAlarmInfoStore from "../../store/alarmInfoStore";
import useUserStore, { useUserPreferStore } from "../../store/userStore";
import { preferenceStore } from "../../store/productStore";
import { BellOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";

interface PcNavBarProps {
  dark: boolean;
  toggleDark: () => void;
}

const PcNavBar: React.FC<PcNavBarProps> = ({ dark, toggleDark }) => {
  const { token, id, setLogOut } = useUserStore();
  const { resetPrefer } = useUserPreferStore();
  const navigate = useNavigate();
  const { reSetPreference } = preferenceStore();
  const { alarms, setAlarmDelete } = useAlarmInfoStore();
  const alarmItems = useRef<Array<any>>();

  // signup 페이지로 이동하는 함수
  const handleSignUpBtnClick = (e: any) => {
    navigate("/user/register");
  };

  // login 페이지로 이동하는 함수
  const handleLogInBtnClick = (e: any) => {
    navigate("/user/login");
  };

  // logout 실행 함수
  const handleLogOutBtnClick = (e: any) => {
    authAxios({
      method: "PUT",
      url: `${process.env.REACT_APP_BACKEND_URL}/users/logout`,
    })
      .then((response) => {
        setAlarmDelete();
        reSetPreference();
        resetPrefer();
        setLogOut(); // userInfo와 token을 초기화
        navigate("/user/login");
      })
      .catch((err) => {
        console.log(err);
        setAlarmDelete();
        reSetPreference();
        resetPrefer();
        setLogOut(); // userInfo와 token을 초기화
        navigate("/user/login");
      });
  };

  useEffect(() => {
    if (token) {
      alarmItems.current = alarms?.map((item, index) => {
        return {
          label: (
            <div
              onClick={() => {
                authAxios({
                  method: "DELETE",
                  url: `${process.env.REACT_APP_BACKEND_URL}/alarms/delete/${item.alarmMessageId}`,
                })
                  .then((response) => {})
                  .catch((error) => {
                    alert("에러가 발생했습니다.");
                  });
              }}
            >
              {item.alarmMessageDate} || {item.alarmMessage}
            </div>
          ),
          key: index,
        };
      });
    }
  }, [token, alarms]);

  return (
    <>
      <header
        className={`flex justify-between items-center w-full p-5 mb-10 ${dark ? "bg-white text-black" : "bg-gray-800 text-white"}`}
      >
        <Link to="/" className="text-start">
          <img src={Logo} alt="로고" className="w-40" />
        </Link>
        <div className="flex items-center justify-between">
          <NavLink
            className={({ isActive }) =>
              `text-lg mx-3 text-nowrap hover:text-black hover:scale-110 transition-color duration-300 ${isActive ? "text-black font-bold dark:text-white" : "text-gray-400"} `
            }
            to="/products"
          >
            방통터치
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `text-lg mx-3 text-nowrap hover:text-black hover:scale-110 transition-colors duration-300 ${isActive ? "text-black font-bold dark:text-white" : "text-gray-400"} `
            }
            to="/chats"
          >
            채팅
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `text-lg mx-3 text-nowrap hover:text-black hover:scale-110 transition-colors duration-300 ${isActive ? "text-black font-bold dark:text-white" : "text-gray-400"}`
            }
            to={`/profile/${id}`}
          >
            마이방통
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `text-lg mx-3 text-nowrap hover:text-black hover:scale-110 transition-colors duration-300 ${isActive ? "text-black font-bold dark:text-white" : "text-gray-400"}`
            }
            to="/boards"
          >
            신통방톡
          </NavLink>

          <div className="flex items-center justify-center mx-3 w-10 h-10">
            {token ? (
              <Dropdown
                trigger={["click"]}
                menu={{ items: alarmItems.current }}
              >
                <Badge
                  count={token ? useAlarmInfoStore.getState().alarmNum : null}
                  className="hover:cursor-pointer"
                >
                  <BellOutlined className="text-xl dark:text-white" />
                </Badge>
              </Dropdown>
            ) : (
              <BellOutlined
                className="text-xl"
                onClick={() => {
                  alert("로그인 후 이용해 주세요.");
                  navigate("/user/login");
                }}
              />
            )}
          </div>

          {/* 로그인 되면 로그아웃 버튼이 뜨도록 */}
          <div className="mx-1">
            {token ? (
              <Btn
                text="로그아웃"
                backgroundColor="bg-red-400"
                onClick={handleLogOutBtnClick}
              />
            ) : (
              <>
                <div className="flex">
                  <div className="me-3">
                    <Btn
                      text="로그인"
                      backgroundColor="bg-lime-500"
                      onClick={handleLogInBtnClick}
                    />
                  </div>
                  <div>
                    <Btn
                      text="회원가입"
                      backgroundColor="bg-yellow-300"
                      onClick={handleSignUpBtnClick}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <FloatButton
        icon={!dark ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleDark}
        tooltip={
          <div>{dark ? "Switch to Dark Mode" : "Switch to Light Mode"}</div>
        }
        className={"bg-yellow-300"}
        style={{ insetInlineEnd: 24, bottom: 24 }}
      />
    </>
  );
};

export default PcNavBar;
