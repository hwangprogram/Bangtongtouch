import axios from "axios";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// 컴포넌트

// css 스타일
import "./InformationPage.css";

// 이미지, 동영상 소스
import Room1 from "../../../assets/RoomCard1.png";
import Room2 from "../../../assets/RoomCard2.png";
import Room3 from "../../../assets/RoomCard3.png";
import Room4 from "../../../assets/RoomCard4.png";

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.3,
    },
  },
};

const item = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const text = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const InformationPage: React.FC = () => {
  const navigate = useNavigate();
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const countRef = useRef<HTMLSpanElement>(null);
  const [productCount, setProductCount] = useState(0);
  const [index, setIndex] = useState(0);
  const textArray = ["원룸", "투룸", "오피스텔", "빌라", "아파트"];
  let animation: any = null;

  useEffect(() => {
    axios({
      url: `${process.env.REACT_APP_BACKEND_URL}/products/count`,
    })
      .then((res) => {
        setProductCount(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % textArray.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [textArray.length]);

  const startCounting = (maxCount: number) => {
    if (animation) {
      animation.stop();
    }
    animation = animate(count, maxCount, { duration: 3 });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && productCount > 0) {
            startCounting(productCount);
            observer.unobserve(entry.target); // 한 번 실행된 후에는 옵저버가 해제되도록 설정
          }
        });
      },
      {
        threshold: 0.5, // 요소가 50% 정도 뷰포트에 들어왔을 때 트리거되도록 설정
      }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
      if (animation) {
        animation.stop();
      }
    };
  }, [count, productCount]);

  const handleLogInBtnClick = (e: any) => {
    navigate("/user/login");
  };

  const theme = {
    token: {
      colorBgTextHover: "#E9FFE7",
      colorPrimary: "#129B07",
    },
  };

  return (
    <main className="w-lvw h-lvh" id="back-ground">
      <motion.div
        className="header text-start"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        <motion.h1
          variants={text}
          transition={{
            ease: "easeIn",
            duration: 0.3,
          }}
        >
          간편한
        </motion.h1>
        <motion.h1
          variants={text}
          transition={{
            ease: "easeIn",
            duration: 0.3,
          }}
        >
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="green"
          >
            {textArray[index]}
          </motion.span>
          승계,
        </motion.h1>
      </motion.div>
      <motion.div
        className="header text-end"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        <motion.h1
          variants={text}
          transition={{
            ease: "easeIn",
            duration: 0.3,
          }}
        >
          <span className="green">방통터치</span>에서
        </motion.h1>
        <motion.h1
          variants={text}
          transition={{
            ease: "easeIn",
            duration: 0.3,
          }}
        >
          시작하세요.
        </motion.h1>
      </motion.div>
      <motion.div
        initial={{
          y: 0,
          opacity: "0%",
        }}
        whileInView={{
          y: -30,
          opacity: "100%",
        }}
        viewport={{ once: false }}
        transition={{
          ease: "easeIn",
          duration: 0.5,
        }}
      >
        <div className="text-center mb-10 footer">
          <motion.h1
            initial={{
              y: 0,
              opacity: "0%",
            }}
            whileInView={{
              y: -30,
              opacity: "100%",
            }}
            viewport={{ once: false }}
            className="mb-10"
          >
            방통터치에서
            <motion.span id="count" viewport={{ once: false }} ref={countRef}>
              {rounded}
            </motion.span>
            개의 매물이 당신을 기다리고 있습니다.
          </motion.h1>
          <motion.ul
            className="flex justify-center"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            <motion.li className="item" variants={item}>
              <img src={Room1} alt="방 1" width={"200px"} />
            </motion.li>
            <motion.li className="item" variants={item}>
              <img src={Room2} alt="방 2" width={"200px"} />
            </motion.li>
            <motion.li className="item hidden md:block" variants={item}>
              <img src={Room3} alt="방 3" width={"200px"} />
            </motion.li>
            <motion.li className="item hidden md:block" variants={item}>
              <img src={Room4} alt="방 4" width={"200px"} />
            </motion.li>
          </motion.ul>
        </div>
      </motion.div>
      <motion.button
        id="start-button"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLogInBtnClick}
      >
        시작하기
      </motion.button>
    </main>
  );
};

export default InformationPage;
