import React, { useRef, useState } from "react";
import authAxios from "../../utils/authAxios";
import { Dropdown, Modal, Select } from "antd";
import useUserStore from "../../store/userStore";
import menuImg from "../../assets/Menu.png";

/**
 *    예시   <SubComment comment_id="까치" content="그건 좀;;" date={273890147923} />
 *  comment_id 작성자명 content 내용 date 시간 long long 형 milisec 단위
 */

interface iUser {
  userId: number;
  nickname: string;
  isBanned: boolean;
}

interface iSubComment {
  commentId: number;
  iuser: iUser;
  content: string;
  deleted?: boolean;
  commentDate: string;
}

const SubComment: React.FC<iSubComment> = ({
  commentId,
  iuser,
  deleted = false,
  content,
  commentDate,
}) => {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const userId = useUserStore().id;
  const [isEditClicked, setIsEditClicked] = useState<boolean>(false);
  const editContent = useRef<string>(content);
  const reportRef = useRef<string>(content);
  const reportTypeRef = useRef<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const changeModalStatus = () => {
    reportRef.current = "";
    setIsModalOpen(!isModalOpen);
  };
  const changeMenuVisible = () => {
    setMenuVisible(!menuVisible);
  };
  const changeIsEditClicked = () => {
    setIsEditClicked(!isEditClicked);
  };
  const deleteComment = () => {
    authAxios({
      method: "PUT",
      url: `${process.env.REACT_APP_BACKEND_URL}/comments/delete/${commentId}`,
    })
      .then((response) => {
        alert("삭제가 완료되었습니다.");
        window.location.replace("");
      })
      .catch((error) => console.log(error));
  };
  const modifyComment = () => {
    authAxios({
      method: "PUT",
      url: `${process.env.REACT_APP_BACKEND_URL}/comments/modify/${commentId}`,
      data: { content: editContent.current },
    })
      .then((response) => {
        alert("수정이 완료되었습니다.");
        window.location.replace("");
      })
      .catch((error) => console.log(error));
  };
  const reportComment = () => {
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
        subjectId: iuser.userId,
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
  const myMenuItem = [
    {
      label: "수정",
      key: 1,
      onClick: changeIsEditClicked,
    },
    {
      label: "삭제",
      key: 2,
      onClick: deleteComment,
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
    <div className="flex pl-4 py-0.5">
      <Modal
        title="댓글 신고"
        open={isModalOpen}
        onOk={reportComment}
        onCancel={changeModalStatus}
      >
        <div>
          <div>댓글 작성자: {iuser.nickname}</div>
          <div>댓글 내용: </div>
        </div>
        <div>{content}</div>
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
      <div className="flex text-xl items-center justify-center pr-2">
        <div>┖</div>
      </div>
      <div className="flex w-full">
        <div className="flex items-center text-base me-3 text-lime-600">
          <p>{deleted === false ? iuser.nickname : "X"}</p>
        </div>
        {isEditClicked === true ? (
          <div className="flex justify-between w-full">
            <input
              className="border w-4/5"
              defaultValue={editContent.current}
              onChange={(e) => (editContent.current = e.target.value)}
              type="text"
            />
            {""}
            <button onClick={modifyComment} className="pr-4">
              수정
            </button>
          </div>
        ) : (
          <React.Fragment>
            <div className="flex items-center justify-between text-base break-words overflow-hidden whitespace-pre-wrap">
              <p>{deleted === false ? content : "삭제된 메시지입니다."}</p>
            </div>
            <div className="flex ml-auto">
              <div className="flex text-xs w-16">
                {formatTimestamp(commentDate)}
              </div>
              {deleted === false ? (
                <Dropdown
                  className="w-6 h-6 rounded-xl mb-3"
                  trigger={["click"]}
                  menu={{
                    items: iuser.userId === userId ? myMenuItem : otherMenuItem,
                  }}
                >
                  <img src={menuImg} alt="" />
                </Dropdown>
              ) : null}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${month}.${day}. ${hours}:${minutes}`;
}
export default SubComment;
