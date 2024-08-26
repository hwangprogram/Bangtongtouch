import React, { useState, InputHTMLAttributes } from "react";
import axios from "axios";
// 아이콘
import { SearchOutlined } from "@ant-design/icons";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "small" | "medium" | "large";
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
}

const SearchBar: React.FC<InputProps> = ({
  placeholder,
  size = "medium",
  id = "",
  width = 400,
  height = 50,
  onChange,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    if (id === "") setIsFocused(true);
  };
  const handleBlur = () => setIsFocused(false);

  const baseInputClasses = `flex items-center mt-1 px-3 py-2 border-2 border-gray-300 block 
      ${isFocused ? "ring-1 ring-lime-500" : ""}`;

  const inputStyle: React.CSSProperties = {};
  if (width) inputStyle.width = width;
  if (height) inputStyle.height = height;

  const inputStyle2: React.CSSProperties = {};
  inputStyle2.width = "95%";
  inputStyle2.height = "90%";
  const sizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };
  const inputClasses = `
      ${sizeClasses[size]}
      ${id === "" ? "text-black" : id === "e" ? "text-text-red-500" : "text-white bg-lime-500"}
      focus:outline-none
      pr-1
    `;

  // 돋보기 아이콘을 클릭 시 axios를 전송하여 게시글 목록을 변경
  const handleIconClick = (e: any) => {
    const val = e.currentTarget.previousElementSibling.value; // 직전의 element인 input에 있는 value를 가져옴
    axios({
      method: "POST",
      url: "http://127.0.0.1:8080/boards/list",
      headers: {
        // headers 내용 넣기
      },
      data: {
        keyword: val,
        // regionId, pageNo, size 등을 zustand 이용하여 data에 넣어줘 전송. 필수값은 아니라 안넣어도 됨
      },
    });
  };

  return (
    <div style={inputStyle} className={baseInputClasses}>
      <input
        style={inputStyle2}
        placeholder={placeholder}
        className={inputClasses}
        {...props}
        type="text"
        required
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        onChange={onChange}
      />
      <SearchOutlined onClick={handleIconClick} onKeyDown={handleIconClick} />
    </div>
  );
};

export default SearchBar;
