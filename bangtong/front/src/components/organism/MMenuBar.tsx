import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authAxios from "../../utils/authAxios";

// 컴포넌트 불러오기
import { Badge, Button, Dropdown, FloatButton, MenuProps } from "antd";

// 이미지 소스
import {
  BellOutlined,
  MenuOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";

// 데이터
import useAlarmInfoStore from "../../store/alarmInfoStore";
import { preferenceStore } from "../../store/productStore";
import useUserStore from "../../store/userStore";

interface MMenuBarProps {
  dark: boolean;
  toggleDark: () => void;
}

const MMenuBar: React.FC<MMenuBarProps> = ({ dark, toggleDark }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { alarms, setAlarmDelete } = useAlarmInfoStore();
  const { token, id, setLogOut } = useUserStore();
  const { reSetPreference } = preferenceStore();
  const alarmItems = useRef<Array<any>>();

  // logout 실행 함수
  const handleLogOutBtnClick = (e: any) => {
    authAxios({
      method: "PUT",
      url: `${process.env.REACT_APP_BACKEND_URL}/users/logout`,
    })
      .then((response) => {
        setAlarmDelete();
        reSetPreference();
        setLogOut(); // userInfo와 token을 초기화
        navigate("/user/login");
      })
      .catch((err) => {
        setAlarmDelete();
        reSetPreference();
        setLogOut(); // userInfo와 token을 초기화
        navigate("/user/login");
      });
  };

  // signup 페이지로 이동하는 함수
  const handleSignUpBtnClick = (e: any) => {
    navigate("/user/register");
  };

  // login 페이지로 이동하는 함수
  const handleLogInBtnClick = (e: any) => {
    navigate("/user/login");
  };

  const items: MenuProps["items"] = id
    ? [
        {
          label: "로그아웃",
          key: "1",
          onClick: handleLogOutBtnClick,
        },
      ]
    : [
        {
          label: "로그인",
          key: "1",
          onClick: handleLogInBtnClick,
        },
        {
          label: "회원가입",
          key: "2",
          onClick: handleSignUpBtnClick,
        },
      ];

  const menuProps = {
    items,
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
                    console.log(error);
                    alert("에러가 발생했습니다.");
                  });
              }}
            >
              <div>{item.alarmMessageDate}</div>
              <div>{item.alarmMessage}</div>
            </div>
          ),
          key: index,
        };
      });
    }
  }, []);

  const floatButtonClass =
    location.pathname.slice(1, 7) === "chats/" &&
    !isNaN(Number(location.pathname.slice(7)))
      ? { insetInlineEnd: 24, bottom: 140 }
      : { insetInlineEnd: 24, bottom: 100 };

  return (
    <>
      <div className="flex justify-end items-center w-screen p-2">
        {token ? (
          <Dropdown trigger={["click"]} menu={{ items: alarmItems.current }}>
            <Badge
              count={token ? useAlarmInfoStore.getState().alarmNum : null}
              className="hover:cursor-pointer"
            >
              <BellOutlined className="text-2xl dark:text-white" />
            </Badge>
          </Dropdown>
        ) : (
          <BellOutlined
            size={30}
            onClick={() => {
              alert("로그인 후 이용해 주세요.");
              navigate("/user/login");
            }}
          />
        )}
        <div className="mx-3">
          <Dropdown menu={menuProps} trigger={["click"]}>
            <Button type="text" size="small">
              <MenuOutlined className="text-2xl dark:text-white" />
            </Button>
          </Dropdown>
        </div>
      </div>
      <FloatButton
        icon={!dark ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleDark}
        tooltip={
          <div>{dark ? "Switch to Dark Mode" : "Switch to Light Mode"}</div>
        }
        className={"bg-yellow-300"}
        style={floatButtonClass}
      />
    </>
  );
};

export default MMenuBar;
