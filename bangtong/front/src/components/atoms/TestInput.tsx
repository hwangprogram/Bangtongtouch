import React, { InputHTMLAttributes } from "react";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  helperText?: string;
  error?: boolean;
  size?: "small" | "medium" | "large";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

}

const TestInput: React.FC<InputProps> = ({
  size = "medium",
  id,
  type,
  value,
  onChange,
  ...props
}) => {
  const sizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const inputClasses = `
    ${sizeClasses[size]}
${id === "" ? "text-black" : id === "e" ? "text-text-red-500" : "text-black bg-white"}
    focus:outline-none
    pr-1
  `;

  const inputStyle: React.CSSProperties = {}
  inputStyle.width = "95%"
  inputStyle.height = "90%;"

  return (
    <input style={{width: "400px", height: "100px"}} className={inputClasses} {...props} type={type} value={value} onChange={onChange}/>
  );
};

export default TestInput;
