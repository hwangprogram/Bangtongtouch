import { Accordion } from "@szhsin/react-accordion";
import React from "react";
import { NavLink } from "react-router-dom";
import useUserStore from "../../store/userStore";

// 컴포넌트
import AccordionPart from "../molecules/AccordionPart";
import ProfileMyFavItems from "./ProfileMyFavItems";
import ProfileMyPostItems from "./ProfileMyPostItems";

// 아이콘
import { ChevronRightIcon } from "@heroicons/react/20/solid";

const ProfileMenu: React.FC = () => {
  const { id } = useUserStore();

  return (
    <div className="mx-2 my-4">
      <Accordion
        transition
        transitionTimeout={200}
        className="dark:hover:text-black"
      >
        <AccordionPart header="내 관심 매물">
          <ProfileMyFavItems />
        </AccordionPart>
      </Accordion>
      <Accordion
        transition
        transitionTimeout={200}
        className="dark:hover:text-black"
      >
        <AccordionPart header="내가 올린 매물">
          <ProfileMyPostItems />
        </AccordionPart>
      </Accordion>
      <NavLink
        className="flex items-center w-full p-4 text-left hover:bg-slate-100 rounded-xl border border-black mb-2"
        to={`/profile/${id}/preference`}
      >
        <p>선호 검색 조건</p>
        <ChevronRightIcon className="w-4 h-4 ml-auto" />
      </NavLink>

      <NavLink
        to={"update"}
        className="flex items-center w-full p-4 text-left hover:bg-slate-100 rounded-xl border border-black mb-2 dark:hover:text-black"
      >
        <p>회원 정보 수정</p>
        <ChevronRightIcon className="w-4 h-4 ml-auto" />
      </NavLink>
      <NavLink
        to={"notification"}
        className="flex items-center w-full p-4 text-left hover:bg-slate-100 rounded-xl border border-black dark:hover:text-black"
      >
        <p>알림 권한 설정</p>
        <ChevronRightIcon className="w-4 h-4 ml-auto" />
      </NavLink>
    </div>
  );
};

export default ProfileMenu;
