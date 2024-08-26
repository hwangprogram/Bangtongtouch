import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// 컴포넌트
import MultiBtn from "../molecules/MultiBtn";
import ContentTable from "../molecules/ContentTable";
import InputBox from "../molecules/InputBox";
import IconBtn from "../atoms/IconBtn";
import { Pagination, ConfigProvider, PaginationProps } from "antd";
import Loading from "../atoms/Loading";

// 이미지 소스
import Pencil from "../../assets/Pencil.png";
import { getUserAddressKr } from "../../utils/services";

interface iUser {
  userId: number;
  nickname: string;
  isBanned: boolean;
}

interface region {
  regionId: string;
  regionSido: string;
  regionGugun: string;
  regionDong: string;
}

interface Content {
  boardId: number;
  boardTitle: string;
  boardWriter: iUser;
  boardContent: string;
  boardDate: string;
  region?: region;
  hit: number;
  boardIsBanned: boolean;
}

const CommunityMain: React.FC = () => {
  // 데이터 (받아온 게시글들)
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [contents, setContents] = useState<Array<Content>>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [communityCategory, setCommunityCategory] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("");
  const keywordRef = useRef<string>("");
  const addr = useRef<number>(0);
  const city = useRef<string>("");

  // pagination 글로벌 디자인 토큰
  const theme = {
    token: {
      colorBgTextHover: "#E9FFE7",
      colorPrimary: "#129B07",
    },
  };

  const darkTheme = {
    token: {
      colorBgTextHover: "#FFFFFF",
      colorPrimary: "#FFFDD0",
    },
  };

  const loadData = () => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/boards/list`,
      data: {
        pageNo: `${page - 1}`,
        size: "10",
        regionId: communityCategory === true ? addr.current : null,
        keyword: `${keywordRef.current === "" ? "" : keywordRef.current}`,
      },
    })
      .then((response) => {
        const page = parseInt(response.data.data.totalElements);
        setContents(response.data.data.content);
        setIsLoaded(true);
        setTotalPages(page);
      })
      .catch((e) => console.log(e));
  };

  const changeCommunityCategory = (flag: boolean) => {
    setCommunityCategory(flag);
  };

  useEffect(() => {
    const getAddress = async () => {
      if (communityCategory === true) {
        setIsLoaded(false);
        const temp: any = await getUserAddressKr().catch((e) => {
          alert("해당 서비스를 이용하시려면 위치 권한을 허용해주셔야합니다.");
          window.location.replace("");
        });
        addr.current = temp[3];
        city.current = temp[1];
        loadData();
        setIsLoaded(true);
      }
    };
    if (communityCategory === true) {
      getAddress();
    } else {
      loadData();
    }
  }, [page, communityCategory, keywordRef.current]);

  const onKeywordChange = () => {
    keywordRef.current = keyword;
    loadData();
  };

  // Pagination 커스터마이징을 위한 itemRender 함수
  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement
  ) => {
    if (type === "prev") {
      return <a className={"dark:text-white"}>Previous</a>;
    }
    if (type === "next") {
      return <a className={"dark:text-white"}>Next</a>;
    }
    return originalElement;
  };

  return (
    <>
      {isLoaded ? (
        <div className="flex flex-col items-center justify-center">
          <h2 className="my-5 text-4xl font-bold text-lime-500 hidden md:block text-nowrap">
            <button className="text-yellow-400">
              {communityCategory ? city.current : ""}
            </button>{" "}
            신통방톡
          </h2>
          <div className="w-full md:w-4/5">
            <InputBox
              placeholder="게시글 검색"
              buttonType="search"
              width="100%"
              height="100%"
              setValue={setKeyword}
              onKeyDown={(e) => {
                if (e.key === "Enter") onKeywordChange();
              }}
              onIconClick={onKeywordChange}
            />
          </div>
          <div className="my-5 md:w-full">
            <MultiBtn setCategory={changeCommunityCategory} />
          </div>
          {isLoaded && <ContentTable contents={contents} />}
          <div className="w-full p-2 mt-5 flex justify-end">
            <Link
              className="bg-yellow-300 p-3 rounded-xl shadow-lg hover:scale-110 ease-in duration-200"
              to={"write"}
            >
              <IconBtn imgSrc={Pencil} size={30} />
            </Link>
          </div>
          <ConfigProvider theme={theme}>
            <Pagination
              current={page}
              total={totalPages}
              className="mt-10"
              responsive
              onChange={(pageNumber) => setPage(pageNumber)}
              itemRender={itemRender}
            />
          </ConfigProvider>
        </div>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </>
  );
};

export default CommunityMain;
