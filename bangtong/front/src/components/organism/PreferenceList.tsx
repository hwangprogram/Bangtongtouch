import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useNavigate } from "react-router-dom";
import useUserStore, { useUserPreferStore } from "../../store/userStore";
import authAxios from "../../utils/authAxios";

// 컴포넌트
import PreferenceBox from "../molecules/PreferenceBox";
import ProfileModal from "../molecules/ProfileModal";

interface PreferenceI {
  preferenceId: number;
  preferenceName: string;
  regionAddress: string;
  preferenceDeposit: number;
  preferenceRent: number;
  preferenceType: string;
  preferenceInfra: string;
  preferenceStartDate: string;
  preferenceEndDate: string;
}

const PreferenceList: React.FC = () => {
  const { id } = useUserStore();
  const [preferenceArr, setPreferenceArr] = useState<PreferenceI[]>([]);
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);

  const [isAnimationCompleted, setIsAnimationCompleted] =
    useState<boolean>(false);

  const { setPreferUpdate } = useUserPreferStore();

  function closeModal() {
    setModalIsOpen(false);
  }

  // 진입 시 설정 전체를 백에서 불러옴
  useEffect(() => {
    authAxios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/preferences/${id}/list`,
    })
      .then((response) => {
        setPreferenceArr([...response.data.data]);
      })
      .catch((err) => console.log(err));
  }, []);

  // 클릭 시 선호 상세 모달을 띄우는 핸들러
  const handlePreferenceDetail = (
    e: React.MouseEvent<HTMLDivElement>,
    prefId: number
  ): void => {
    if ((e.target as HTMLElement).tagName === "BUTTON") {
      return; // button이 클릭된 경우 div의 클릭 이벤트를 무시
    }
    setSelectedId(prefId);
    setModalIsOpen(true);
  };

  // 클릭 시 선호 생성 모달을 띄우는 핸들러
  const handlePreferenceCreate = (): void => {
    setSelectedId(0);
    setModalIsOpen(true);
  };

  // 클릭 시 삭제하는 핸들러
  const handlePreferenceDelete = (prefId: number): void => {
    authAxios({
      method: "DELETE",
      url: `${process.env.REACT_APP_BACKEND_URL}/preferences/delete/${prefId}`,
    })
      .then((response) => {
        setPreferenceArr(
          preferenceArr.filter((el) => el.preferenceId !== prefId)
        ); // preferenceId가 삭제될 prefId가 아닌 놈만 반환
      })
      .catch((err) => console.log(err));
  };

  // postcode 팝업
  const open = useDaumPostcodePopup();

  // 선호 설정 적용하는 핸들러
  const handlePreferenceApplicate = (prefId: number) => {
    const selectedPreference = preferenceArr.find(
      (el: any) => el.preferenceId === prefId
    );
    if (selectedPreference) {
      // 주소검색 팝업 부분
      setPreferUpdate(selectedPreference);
    }
  };

  const addpreferenceArr = (prefArr: any) => {
    setPreferenceArr([...preferenceArr, prefArr]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.5,
        ease: [0, 0.7, 0.2, 1],
      }}
      onAnimationComplete={() => setIsAnimationCompleted(true)}
    >
      <div className="w-full flex text-nowrap items-center justify-between mt-5">
        <h2 className="text-xl text-left text-lime-500 font-bold">
          나의 선호 설정 관리
        </h2>
        <div>
          <button
            className="bg-yellow-400 ml-auto py-1 px-4 rounded-md text-white"
            onClick={handlePreferenceCreate}
          >
            만들기
          </button>
          &nbsp;&nbsp;
          <button
            className="bg-gray-400 ml-auto py-1 px-4 rounded-md text-white"
            onClick={() => navigate(`/profile/${id}`)}
          >
            메뉴로
          </button>
        </div>
      </div>
      <div className="flex flex-col mt-5 items-center justify-center text-center">
        {preferenceArr.length ? (
          preferenceArr.map((pref: PreferenceI, idx) => {
            return (
              <PreferenceBox
                key={idx}
                delayOrd={idx}
                preferenceId={pref.preferenceId}
                preferenceName={pref.preferenceName}
                preferenceDeposit={pref.preferenceDeposit}
                preferenceRent={pref.preferenceRent}
                regionAddress={pref.regionAddress}
                handlePreferenceDetail={handlePreferenceDetail}
                handlePreferenceApplicate={handlePreferenceApplicate}
                handlePreferenceDelete={handlePreferenceDelete}
                isAnimationCompleted={isAnimationCompleted}
              />
            );
          })
        ) : (
          <div className="flex items-center justify-center h-24 w-64 bg-yellow-200 text-gray-800 font-semibold text-lg rounded-lg shadow-md">
            등록된 설정이 없습니다.
          </div>
        )}
      </div>
      <ProfileModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        selectedId={selectedId}
        addpreferenceArr={addpreferenceArr}
        className={"dark:text-black dark:bg-gray-800"}
      />
    </motion.div>
  );
};

export default PreferenceList;
