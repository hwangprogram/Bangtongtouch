import React, { useRef, useState } from "react";

// 아이콘
import { VideoCameraOutlined, WarningOutlined } from "@ant-design/icons";
import { Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";
import authAxios from "../../utils/authAxios";

interface ChatAdditionalBarProps {
  roomId: string;
  reportUserId: number;
  reportUserNickname: string;
}

const ChatAdditionalBar: React.FC<ChatAdditionalBarProps> = ({
  roomId,
  reportUserId,
  reportUserNickname,
}) => {
  const navigate = useNavigate();
  const reportRef = useRef<string>("");
  const reportTypeRef = useRef<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const changeModalStatus = () => {
    reportRef.current = "";
    setIsModalOpen(!isModalOpen);
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
        reportSubjectTypeId: 2,
        reportTypeId: reportTypeRef.current,
        content: reportRef.current,
        subjectId: reportUserId,
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

  return (
    <div className="w-full bg-yellow-200 fixed md:static bottom-16 left-0 flex justify-around p-2 md:rounded-2xl">
      <Modal
        title="사용자 신고"
        open={isModalOpen}
        onOk={reportComment}
        onCancel={changeModalStatus}
      >
        <div>
          <div>채팅 작성자: {reportUserNickname}</div>
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
      <button
        className="text-center"
        onClick={(e) => {
          // navigate(`/`);
          navigate(`/chats/videochat/${roomId}`);
        }}
      >
        <VideoCameraOutlined />
        <p>라이브 시작</p>
      </button>
      <button className="text-center" type="button" onClick={changeModalStatus}>
        <WarningOutlined />
        <p>신고하기</p>
      </button>
    </div>
  );
};

export default ChatAdditionalBar;
