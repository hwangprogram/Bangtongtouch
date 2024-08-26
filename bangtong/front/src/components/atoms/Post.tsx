import React from "react";
import { Link } from "react-router-dom";

interface PostsProps {
  id: number;
  title: string;
  writer: string;
  date: string;
}

const Post: React.FC<PostsProps> = ({ id, title, writer, date }) => {
  return (
    <tr>
      <td className="bg-gray-100 border-t-2 border-gray-200 p-2 text-center">
        <Link to={`/boards/${id}`}>{title}</Link>
      </td>
      <td className="bg-gray-100 border-t-2 border-gray-200 p-2 text-center">
        {writer}
      </td>
      <td className="bg-gray-100 border-t-2 border-gray-200 p-2 text-center">
        {date.slice(11, 16)}
      </td>
    </tr>
  );
};

export default Post;
