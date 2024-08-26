import React, { useRef } from "react";
import authAxios from "../../utils/authAxios";

interface SubCommentInputProps {
  parentId: number;
  boardId?: string;
}

const SubCommentInput: React.FC<SubCommentInputProps> = ({
  parentId,
  boardId,
}) => {
  const content = useRef<string>("");
  const postSubCommentInput = () => {
    if (content.current === "") return;
    authAxios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/comments/${boardId}/write`,
      headers: {},
      data: {
        content: content.current,
        parentId,
      },
    })
      .then(() => {
        alert("등록이 되었습니다.");
        window.location.replace("");
      })
      .catch((err) => console.log(err));
  };
  return (
    <form className="border flex justify-between px-4 dark:text-black dark:bg-white">
      <input
        type="text"
        placeholder="대댓글을 입력해주세요."
        onChange={(e) => (content.current = e.target.value)}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          postSubCommentInput();
        }}
      >
        등록
      </button>
    </form>
  );
};

export default SubCommentInput;
