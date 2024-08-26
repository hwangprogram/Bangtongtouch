import React from "react";
import {Outlet} from "react-router-dom";


// 컴포넌트
import MMenuBar from "../organism/MMenuBar"; // 모바일 메뉴바 (알림, 햄버거버튼)
import MNavBar from "../organism/MNavBar"; // 모바일 네비게이션바
import PcNavBar from "../organism/PcNavBar"; // PC 네비게이션바
import PcFooter from "../organism/PcFooter"; // PC 푸터
import ScrollToTop from "../atoms/ScrollToTop";

const Layout: React.FC = () => {
    const [dark, setDark] = React.useState(false);
    const toggleDark = () => {
        setDark(!dark);
        document.body.classList.toggle("dark");
    };

    return (
        <div className="flex flex-col min-h-screen">
            <ScrollToTop/>
            <div className="md:hidden">
                <MMenuBar dark={!dark} toggleDark={toggleDark}/>
            </div>
            <div className="hidden md:block">
                <PcNavBar dark={!dark} toggleDark={toggleDark}/>
            </div>
            <div className="flex flex-1 flex-col items-center mx-10 mb-10">
                <Outlet/>
            </div>
            <div className="md:hidden">
                <MNavBar/>
            </div>
            <div className="hidden md:block">
                <PcFooter/>
            </div>
        </div>
    );
};

export default Layout;
