import React from "react";

// 게시글 데이터

// 컴포넌트
import Post from "../atoms/Post";

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

interface ContentTableProps {
  contents: Array<Content>;
}

const ContentTable: React.FC<ContentTableProps> = ({ contents }) => {
  return (
    <table className="border-collapse w-full text-sm text-nowrap dark:text-black">
      <thead className="bg-yellow-100">
        <tr>
          <th className="p-2">제목</th>
          <th className="p-2">작성자</th>
          <th className="p-2">작성시간</th>
        </tr>
      </thead>

      <tbody>
        {/* contents가 빈 배열일 경우 예외처리 */}
        {contents ? (
          contents
            .filter((content) => content.boardIsBanned !== true)
            .map((content) => (
              <Post
                key={content.boardId}
                id={content.boardId}
                title={content.boardTitle}
                writer={content.boardWriter.nickname}
                date={content.boardDate}
              />
            ))
        ) : (
          <Post
            id={0}
            title={"게시글 없음"}
            writer={"게시글 없음"}
            date={"0000-00-00 00:00"}
          />
        )}
      </tbody>
    </table>
  );
};

export default ContentTable;
