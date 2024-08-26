import axios from "axios";
import React, { useRef, useState } from "react";
import useUserStore from "../../store/userStore";

// 컴포넌트
import { Button, ConfigProvider, Input, Modal } from "antd";
import Btn from "../atoms/Btn";
import ProfileImgBox from "../atoms/ProfileImgBox";

// 이미지 소스
import { UploadOutlined } from "@ant-design/icons";
import defaultProfile from "../../assets/defaultprofile.jpg";

const ProfileBox: React.FC = () => {
  const { id, nickname, profileImage, setprofileUpdate } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImgFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserNickname(event.target.value);
  };

  const profileUpdate = async () => {
    setIsModalOpen(false);

    const formData = new FormData();

    formData.append("nickname", userNickname as string);
    formData.append("profileImage", imgFile as File);

    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_BACKEND_URL}/users/modify/${id}/profile`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res: any) => {
        setprofileUpdate(
          `https://bangtong-bucket.s3.ap-northeast-2.amazonaws.com/${res.data.data.profileImage}`,
          res.data.data.nickname
        );
      })
      .catch((e) => console.log(e));
  };

  // ant design 글로벌 디자인 토큰
  const theme = {
    token: {
      colorBgTextHover: "#E9FFE7",
      colorPrimary: "#129B07",
      colorPrimaryBorder: "#129B07",
    },
  };

  // 파일 등록 시 확장자 유효성판정 후 업로드
  const onFileChange = (fileInput: any, fileType: string) => {
    if (fileInput) {
      const extensionName = fileInput.name.split(".").pop().toLowerCase(); // 파일명에서 확장자명 추출
      if (
        ["jpg", "png", "gif"].includes(extensionName) &&
        fileType === "사진"
      ) {
        setImgFile(() => fileInput);
      } else {
        window.alert(
          "지원하지 않는 형식의 파일입니다\n*확장자가 jpg, png, gif, mp4인 파일만 등록 가능"
        );
      }
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <ProfileImgBox src={profileImage} profileId={id} />
      <div id="profileName" className="flex flex-col items-center">
        <p className="font-bold my-3 text-nowrap">{nickname}님 안녕하세요</p>
        <div className="mb-3">
          <Btn
            text="프로필 편집"
            textSize="text-sm font-bold"
            width="w-28"
            backgroundColor="bg-lime-500"
            textColor="white"
            hoverBackgroundColor="hover:bg-lime-400 transitioin-color duration-300"
            onClick={() => setIsModalOpen(true)}
          />
          <ConfigProvider theme={theme}>
            <Modal
              title="프로필 편집"
              open={isModalOpen}
              onCancel={() => setIsModalOpen(false)}
              footer={
                <div className="flex justify-center items-center mt-10">
                  <Button
                    className="me-4"
                    type="primary"
                    size="large"
                    onClick={profileUpdate}
                  >
                    수정 완료
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    danger
                    onClick={() => setIsModalOpen(false)}
                  >
                    취소
                  </Button>
                </div>
              }
            >
              <div className="flex items-center justify-center mt-7">
                <h2 className="text-nowrap me-2">닉네임 : </h2>
                <Input
                  placeholder={nickname}
                  allowClear
                  onChange={handleNickname}
                />
              </div>
              <input
                type="file"
                className="hidden"
                ref={inputRef}
                onChange={handleFileChange}
              />
              <button
                className="w-full mt-10 relative"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={handleUploadButtonClick}
              >
                <img
                  src={previewImage || profileImage || defaultProfile}
                  alt="프로필 이미지"
                  className="rounded-full mx-auto object-cover"
                  style={{
                    width: 300,
                    height: 300,
                    filter: hover ? "brightness(50%)" : "none",
                  }}
                />
                {hover && (
                  <div className="absolute inset-0 flex items-center justify-center text-lime-500 text-lg font-bold">
                    <UploadOutlined className="font-bold text-2xl me-3" />
                    <p>파일 업로드하기</p>
                  </div>
                )}
              </button>
            </Modal>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};

export default ProfileBox;
