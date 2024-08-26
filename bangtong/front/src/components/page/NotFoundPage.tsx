import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex w-full h-full justify-center items-center">
      <Button className="flex-col" onClick={() => navigate("/")}>
        존재하지 않는 페이지입니다. 메인페이지로 이동하시겠습니까?
      </Button>
    </div>
  );
};

export default NotFoundPage;
