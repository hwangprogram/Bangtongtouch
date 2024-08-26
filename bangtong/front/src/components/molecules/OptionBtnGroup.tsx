import React from "react";

// 컴포넌트
import OptionBtn from "../atoms/OptionBtn";

const OptionBtnGroup: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center">
      <OptionBtn 
        text="풀옵션"
      />
      <OptionBtn 
        text="가스레인지"
      />
      <OptionBtn 
        text="냉장고"
      />
      <OptionBtn 
        text="세탁기"
      />
      <OptionBtn 
        text="에어컨"
      />
      <OptionBtn 
        text="전자레인지"
      />
      <OptionBtn 
        text="침대"
      />
      <OptionBtn 
        text="티비"
      />
    </div>
  )
}

export default OptionBtnGroup;