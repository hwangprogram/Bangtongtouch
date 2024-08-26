import React from "react";
import { Link } from "react-router-dom";

// 컴포넌트
import TextBox from "./TextBox";

// 이미지 소스
import defaultHomeImage from "../../assets/defaulthome.png";

interface ImgBoxProps {
  id: number;
  title: string;
  price?: string;
  info: string;
  src?: string;
  borderRadius?: string;
}

const ImgBox: React.FC<ImgBoxProps> = ({
  id,
  title,
  price = "",
  info,
  src,
  borderRadius = "rounded-xl",
}) => {
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = defaultHomeImage;
  };
  return (
    <Link
      className={`${borderRadius} bg-gray-100 flex items-center my-5 font-bold`}
      to={`/products/${id}`}
    >
      <div className="w-full p-3 align-middle">
        <TextBox text={title} size="base" color="black" />
        <TextBox text={info} size="xs" color="lime-500" />
      </div>
      <img
        src={src}
        alt="방사진"
        className="w-20 rounded-e-xl object-fill"
        onError={handleImageError}
      />
    </Link>
  );
};

export default ImgBox;
