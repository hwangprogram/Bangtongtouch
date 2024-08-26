import React, { InputHTMLAttributes, useState } from "react";
import IconBtn from "../atoms/IconBtn";

// 아이콘
import Cancel from "../../assets/CancelCircle.png";
import Check from "../../assets/CheckCircle.png";
import DropDownIcon from "../../assets/DropDownIcon.png";
import Search from "../../assets/Search.png";
import Send from "../../assets/Send.png";

/**
 * 검증 오류가 발생하였을 경우 id 값을 "e" 검증이 되었을 경우 "q", 기본 상태 "" 처럼 빈 값 string 변수로 전달
 * password, email 등의 type 전달
 * placeholder 전달
 * size => 글자 크기
 * width, height 픽셀 단위 크기
 * 추후 상태 관리 추가하여 기본 상태에서 포커싱 될 때 초록색 아웃라인 설정과
 * X 버튼 눌렀을 때 input 값 지우는 로직 작성하여야 함.
 * 
 * <InputBox
      placeholder="이메일 (아이디)"
      size="small"
      type="email"
      id=""
      width={400}
      height={96}
    />

 */

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  helperText?: string;
  error?: boolean;
  size?: "small" | "medium" | "large";
  buttonType?: "cancel" | "check" | "dropdown" | "send" | "search"; // cancel, check, dropdown, send, search
  boxSize?: "mobile" | "pc";
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  onIconClick?: React.MouseEventHandler;
}

const InputBox: React.FC<InputProps> = ({
  helperText,
  error = false,
  placeholder,
  buttonType,
  size = "medium",
  boxSize = "mobile",
  type,
  id = "",
  width = 400,
  height = 50,
  onChange,
  value,
  setValue,
  onIconClick,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    if (id === "") setIsFocused(true);
  };
  const handleBlur = () => setIsFocused(false);

  const errorClasses =
    "border-red-500 focus:border-red-500 focus:ring-red-500 text-red-600 focus:text-red-500";
  const qualifiedClasses = "border-lime-500 text-white focus:text-white";

  const baseInputClasses = `flex items-center ${boxSize === "mobile" ? "w-full" : "w-3/5"} mt-1 px-3 py-2 ${id === "q" ? "bg-lime-500" : "bg-white"}  border-2 border-gray-300 block rounded-full
    ${isFocused ? "ring-1 ring-lime-500" : ""}
    ${id === "e" ? errorClasses : ""}
    ${id === "q" ? qualifiedClasses : ""}`;

  let whatBtn = "";

  if (buttonType === "cancel") {
    whatBtn = Cancel;
  } else if (buttonType === "check") {
    whatBtn = Check;
  } else if (buttonType === "dropdown") {
    whatBtn = DropDownIcon;
  } else if (buttonType === "send") {
    whatBtn = Send;
  } else if (buttonType === "search") {
    whatBtn = Search;
  }

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

  // x 아이콘을 클릭 시 해당 input의 value를 빈 문자열로 초기화
  const handleIconClick = () => {
    if (setValue) {
      setValue("");
    }
    if (onChange) {
      const event = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  return (
    <div>
      <div className={baseInputClasses}>
        <input
          style={inputStyle2}
          placeholder={placeholder}
          className={inputClasses}
          {...props}
          type={type}
          required
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          onChange={(e) => {
            e.preventDefault();
            if (setValue) {
              setValue(e.target.value);
            }
            if (onChange) onChange(e);
          }}
        />
        <IconBtn
          className={whatBtn ? "" : "hidden"}
          imgSrc={whatBtn}
          size={20}
          onIconClick={onIconClick}
        />
      </div>
      {helperText && (
        <p
          className={`mt-1 text-sm ${error ? "text-red-500" : "text-gray-500"}`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default InputBox;
