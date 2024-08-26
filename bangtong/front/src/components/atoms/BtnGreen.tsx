import React from "react";
import Btn from "./Btn";

const BtnGreen: React.FC = () => {
    return(
        <div>
            <Btn 
            text="버튼입니다."
            backgroundColor="[#129B07]"
            textColor="white"
            />
        </div>
    )
}

export default BtnGreen;