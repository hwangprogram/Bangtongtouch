import React from "react";
import defaultHomeImage from "../../assets/defaulthome.png";

interface ImgCardProps {
  src?: string;
  borderRadius?: string;
  width?: string;
  height?: string;
}

const ImgCard: React.FC<ImgCardProps> = ({
  src,
  borderRadius = "rounded-xl",
  width = "w-36",
  height = "h-24",
}) => {
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = defaultHomeImage;
  };
  return (
    <div className={`${borderRadius} ${width} ${height}`}>
      <img
        src={src}
        className="object-fill"
        alt="대체 이미지"
        onError={handleImageError}
      />
    </div>
  );
};

export default ImgCard;
