import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

import ScrollToTop from "../atoms/ScrollToTop";

// 이미지 소스
import homeImg from "../../assets/homeImg.png";
import BlackLogo from "../../assets/BlackLogo.png";
import { Link } from "react-router-dom";

const UserPage: React.FC = () => {
  const variants = {
    inital: {
      y: 0,
    },
    target: {
      y: -10,
    },
  };

  return (
    <div className="bg-yellow-200">
      <ScrollToTop />
      <div className="flex justify-between items-center w-full h-20 px-5 hidden md:flex">
        <Link to="/" className="text-start">
          <img src={BlackLogo} alt="로고" className="w-40" />
        </Link>
        <p className="text-lg">원룸 승계 중개 서비스</p>
      </div>
      <motion.div
        variants={{
          initial: {
            y: 0,
          },
          target: {
            y: -20,
          },
        }}
        initial="inital"
        animate="target"
        transition={{
          ease: "easeInOut",
          duration: 0.7,
          repeatDelay: 3,
        }}
        className="px-10 flex items-center justify-center"
      >
        <div className="mr-20 lg:mr-40 hidden md:block w-96">
          <p className="text-xl lg:text-2xl font-bold mb-2 text-center text-nowrap">
            당신의 스마트한 승계를 돕습니다.
          </p>
          <p className="text-lg lg:text-xl font-bold mb-10 text-center text-nowrap">
            <span className="text-lime-600">방통터치</span>를 지금 바로 시작해
            보세요.
          </p>
          <img src={homeImg} alt="집 사진" />
        </div>
        <motion.div
          variants={variants}
          initial="inital"
          animate="target"
          transition={{
            ease: "easeInOut",
            duration: 0.7,
            repeatDelay: 3,
          }}
          className="h-lvh flex flex-col items-center justify-center"
        >
          <div className="w-full md:w-96 p-10 bg-white rounded-2xl my-20">
            <Outlet />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserPage;
