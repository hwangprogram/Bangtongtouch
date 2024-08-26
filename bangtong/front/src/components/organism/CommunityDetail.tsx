import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// 컴포넌트
import menuImg from "../../assets/Menu.png";
import Comment from "../atoms/Comment";
import RollBackBtn from "../atoms/RollBackBtn";

// Store
import { Dropdown, Modal, Select } from "antd";
import useUserStore from "../../store/userStore";
import authAxios from "../../utils/authAxios";

interface region {
  regionId: string;
  regionSido: string;
  regionGugun: string;
  regionDong: string;
}

interface iUser {
  userId: number;
  nickname: string;
  isBanned: boolean;
}
interface IBoardContent {
  boardId: number;
  boardTitle: string;
  boardContent: string;
  region: region;
  hit: number;
  boardDate: string;
  boardWriter: iUser;
  boardIsBanned: boolean;
}

interface iSubComment {
  commentId: number;
  iuser: iUser;
  deleted: boolean;
  content: string;
  commentDate: string;
}

interface IComment {
  commentId: number;
  iuser: iUser;
  content: string;
  deleted?: boolean;
  commentDate: string;
  subcomments?: Array<iSubComment>;
}

const CommunityDetail: React.FC = () => {
  let { id } = useParams<{ id: string }>(); // 게시물 번호

  const [boardContent, setBoardContent] = useState<IBoardContent>();
  const [comments, setComments] = useState<Array<IComment>>([]);
  const commentRef = useRef<string>("");

  const userId = useUserStore().id;
  const navigate = useNavigate();

  const reportRef = useRef<string>("");
  const reportTypeRef = useRef<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const changeModalStatus = () => {
    reportRef.current = "";
    setIsModalOpen(!isModalOpen);
  };

  // 댓글을 받아오는 함수
  const handleCommentGet = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/comments/${id}`,
      headers: {},
    })
      .then((response) => {
        setComments(response.data.data);
      })
      .catch((e) => {});
  };

  // 댓글 작성 함수. 백엔드로 댓글을 전송하고 그 데이터를 활용해 댓글 리스트 state에 하나를 붙여 갱신
  const handleCommentCreate = (boardId: number, content: string) => {
    authAxios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/comments/${boardId}/write`,
      headers: {},
      data: {
        content,
      },
    })
      .then((response) => {
        alert("등록이 되었습니다.");
        window.location.replace("");
      })
      .catch(() => {
        alert("로그인 후 작성하실 수 있습니다.");
      });
  };

  // 상세 페이지로 이동 시, 페이지 정보를 받아오는 함수. board 안에 상세페이지의 모든 정보가 저장됨
  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/boards/${id}`,
    })
      .then((response) => {
        setBoardContent(response.data.data);
      })
      .catch((err) => {
        alert("존재하지 않는 페이지입니다.");
        navigate("/boards");
      });
    handleCommentGet();
  }, []);

  const reportBoard = () => {
    if (reportTypeRef.current === 0) {
      alert("신고 유형을 선택해주세요.");
      return;
    }

    if (reportRef.current === "") {
      alert("사유를 입력해주세요.");
      return;
    }
    authAxios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/reports`,
      data: {
        reportSubjectTypeId: 0,
        reportTypeId: reportTypeRef.current,
        content: reportRef.current,
        subjectId: parseInt(id!!),
      },
    })
      .then((response) => {
        alert("신고가 완료되었습니다.");
        reportRef.current = "";
      })
      .catch((error) => {
        alert("로그인 후 이용하실 수 있습니다.");
      });
    changeModalStatus();
  };

  const sanitizedData = () => ({
    __html: boardContent !== undefined ? boardContent.boardContent : "",
  });

  const deleteBoard = () => {
    authAxios({
      method: "PUT",
      url: `${process.env.REACT_APP_BACKEND_URL}/boards/delete/${id}`,
    })
      .then((response) => {
        if (response.status === 200) {
          alert("삭제가 완료되었습니다.");
          navigate("../", { replace: true });
        }
      })
      .catch((error) => {
        alert("에러가 발생했습니다.");
      });
  };

  const editBoard = () => {
    navigate(`/boards/write?id=${id}`);
  };

  const myMenuItem = [
    {
      label: "수정",
      key: 1,
      onClick: editBoard,
    },
    {
      label: "삭제",
      key: 2,
      onClick: deleteBoard,
    },
  ];

  const otherMenuItem = [
    {
      label: "신고",
      key: 1,
      onClick: changeModalStatus,
    },
  ];

  return (
    <div>
      <Modal
        title="게시글 신고"
        open={isModalOpen}
        onOk={reportBoard}
        onCancel={changeModalStatus}
      >
        <div>
          <div>게시글 작성자: {boardContent?.boardWriter.nickname}</div>
        </div>
        <Select
          defaultValue={"신고 유형"}
          className="w-full my-2"
          onChange={(e) => {
            reportTypeRef.current = parseInt(e);
          }}
          options={[
            { value: 1, label: "스팸/도배" },
            { value: 2, label: "음란물" },
            { value: 3, label: "유해한 내용" },
            { value: 4, label: "비속어/차별적 표현" },
            { value: 5, label: "개인정보 노출" },
            { value: 6, label: "불쾌한 표현" },
          ]}
        />
        <span>신고 사유</span>
        <textarea
          className="w-full border resize-none"
          onChange={(e) => {
            reportRef.current = e.target.value;
          }}
        />
      </Modal>
      <div className="mt-10">
        {boardContent ? (
          <div>
            <div className="flex justify-between">
              <RollBackBtn />
              <Dropdown
                className="w-10 rounded-xl mb-3 dark:text-white hover:cursor-pointer"
                trigger={["click"]}
                menu={{
                  items:
                    boardContent.boardWriter.userId === userId
                      ? myMenuItem
                      : otherMenuItem,
                }}
              >
                <img src={menuImg} alt="" />
              </Dropdown>
            </div>
            <h1 className="text-2xl font-bold">{boardContent.boardTitle}</h1>
            <div className="mt-2 flex justify-between">
              <div>
                <span className="pe-2">
                  {boardContent.boardWriter.nickname}
                </span>
                |<span className="ps-2">{boardContent.boardDate}</span>
              </div>
              <div>조회 {boardContent.hit}</div>
            </div>
            <div className="mt-5 board-content">
              <div dangerouslySetInnerHTML={sanitizedData()} />
            </div>
            <div>
              <div className="mt-10 w-full bg-lime-400 p-3">댓글 목록</div>
              {comments.map((comment: any) => {
                return (
                  <Comment
                    key={comment.commentId}
                    commentId={comment.commentId}
                    deleted={comment.deleted}
                    iuser={comment.iuser}
                    content={comment.content}
                    commentDate={comment.commentDate}
                    subcomments={comment.subcomments}
                    boardId={id}
                  />
                );
              })}
              <form className="mt-5 bg-gray-200 pb-3 rounded-lg">
                <textarea
                  placeholder="댓글 입력"
                  name="message"
                  rows={4}
                  className="block p-2.5 w-full text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-lime-300 focus:border-lime-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
                  onChange={(e) => (commentRef.current = e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        handleCommentCreate(Number(id), commentRef.current);
                      }
                    }
                  }}
                ></textarea>
                <button
                  className="bg-lime-400 p-2 rounded-lg mt-3 ms-3 px-5 text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCommentCreate(Number(id), commentRef.current);
                  }}
                >
                  댓글 작성하기
                </button>
              </form>
            </div>
          </div>
        ) : (
          <p>게시글을 찾을 수 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default CommunityDetail;
