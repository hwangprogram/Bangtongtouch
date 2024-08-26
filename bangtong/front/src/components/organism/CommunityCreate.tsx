import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// 컴포넌트
import RollBackBtn from "../atoms/RollBackBtn";
import DropDown from "../molecules/DropDown";

// 이미지 소스
import axios, { HttpStatusCode } from "axios";
import useUserStore from "../../store/userStore";
import authAxios from "../../utils/authAxios";
import { getUserAddressKr } from "../../utils/services";
import TextEditor from "../molecules/TextEditor";

const CommunityCreate: React.FC = () => {
  const [textEditorValue, setTextEditorValue] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const { token } = useUserStore();
  const userId = useUserStore().id;

  const [category, setCategory] = useState<string>("게시판 종류 선택");
  const addr = useRef<number>();

  const redirectToBoards = () => {
    navigate("../", { replace: true });
  };

  if (token === null) {
    alert("로그인 후 이용하실 수 있습니다.");
    redirectToBoards();
  }
  useEffect(() => {
    const getAddress = async () => {
      if (category === "내 지역") {
        const temp: any = await getUserAddressKr().catch((e) => {
          alert("해당 서비스를 이용하시려면 위치 권한을 허용해주셔야합니다.");
          window.location.replace("");
        });
        addr.current = temp[3];
      }
    };
    getAddress();
  }, [category]);
  useEffect(() => {
    if (id !== null) {
      axios({
        method: "GET",
        url: `${process.env.REACT_APP_BACKEND_URL}/boards/${id}`,
      })
        .then((response) => {
          setTitleValue(response.data.data.boardTitle);
          setTextEditorValue(response.data.data.boardContent);
        })
        .catch((err) => {
          alert("에러가 발생하였습니다.");
          redirectToBoards();
        });
    }
  }, []);

  return (
    <div>
      <div className="mt-10">
        <RollBackBtn />
      </div>
      <div className="rounded-lg dark:text-black">
        <div className="bg-lime-500 flex justify-between p-2 rounded-t-lg">
          <input
            className="bg-transparent w-full focus:outline-none text-white placeholder:text-white"
            type="text"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            placeholder="제목을 입력해주세요."
          />
          <DropDown
            title="게시판 종류 선택"
            itemList={["전체", "내 지역"]}
            rounded="lg"
            backgroundColor="yellow-color"
            onSelected={setCategory}
          />
        </div>
        <TextEditor data={textEditorValue} onChange={setTextEditorValue} />
        <div className="flex justify-end items-center bg-gray-200 rounded-b-lg">
          <button
            type="submit"
            className="bg-lime-400 p-2 px-10 rounded-lg m-3 text-black"
            onClick={(e) => {
              e.preventDefault();
              if (titleValue === "") {
                alert("제목을 입력해주세요.");
                return;
              }
              if (textEditorValue === "") {
                alert("내용을 입력해주세요.");
                return;
              }

              const data = new FormData();
              data.append("boardTitle", titleValue);
              data.append("boardContent", textEditorValue);
              data.append("boardWriter", userId.toString());
              if (id === null) {
                authAxios({
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                  },
                  url: `${process.env.REACT_APP_BACKEND_URL}/boards/write${category === "내 지역" ? "/" + addr.current : ""}`,
                  data: {
                    boardTitle: titleValue,
                    boardContent: textEditorValue,
                    boardWriter: userId,
                  },
                })
                  .then((response) => {
                    if (response.status === HttpStatusCode.Ok) {
                      alert("글이 등록되었습니다.");
                      redirectToBoards();
                    } else alert("오류가 발생하였습니다.");
                  })
                  .catch((error) => {
                    alert("로그인 후 이용해주세요.");
                    navigate("/user/login");
                  });
              } else {
                authAxios({
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                  },
                  url: `${process.env.REACT_APP_BACKEND_URL}/boards/modify/${id}`,
                  data: {
                    boardTitle: titleValue,
                    boardContent: textEditorValue,
                  },
                })
                  .then((response) => {
                    if (response.status === HttpStatusCode.Ok) {
                      alert("수정이 완료되었습니다.");
                      redirectToBoards();
                    } else alert("오류가 발생하였습니다.");
                  })
                  .catch((error) => console.log("전송 실패", error));
              }
            }}
          >
            {id === null ? "작성하기" : "수정하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityCreate;
