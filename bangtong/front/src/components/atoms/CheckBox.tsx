import React from 'react';

// 체크박스 사이즈가 마음에 안드시면 tailwind 문법으로 width, height를 지정하셔서 넣어주시면 됩니다. 
interface CheckBoxProps {
  width?: string;
  height?: string;
}

const CheckBox: React.FC<CheckBoxProps> = (width, height) => {
  return (
    <input type="checkbox" className={`${width} ${height}`} style={{accentColor: '#129B07'}} />
  );
}

export default CheckBox;