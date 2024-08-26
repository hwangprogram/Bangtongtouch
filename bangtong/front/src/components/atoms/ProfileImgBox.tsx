import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 이미지 소스
import defaultprofile from "../../assets/defaultprofile.jpg";

interface ImageWithFallbackProps {
  src: string | null;
  profileId: number;
}

const ProfileImgBox: React.FC<ImageWithFallbackProps> = ({
  src,
  profileId,
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleError = () => {
    setIsLoaded(false);
  };

  return (
    <React.Fragment>
      <img
        src={src ? process.env.REACT_APP_BACKEND_SRC_URL + src : defaultprofile}
        alt="프로필 이미지"
        width={50}
        height={50}
        onError={handleError}
        className="rounded-full me-10"
        style={{ display: isLoaded ? "block" : "none" }}
        onClick={() => navigate(`/profile/${profileId}`)}
      />
      {!isLoaded && (
        <img
          src={defaultprofile}
          alt="기본 프로필 이미지"
          width={50}
          height={50}
          className="rounded-full me-10"
          style={{ display: isLoaded ? "none" : "block" }}
        />
      )}
    </React.Fragment>
  );
};

export default ProfileImgBox;
