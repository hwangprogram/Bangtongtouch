import React from "react";

interface AttachmentProps {
  onFileChange: (e: any) => void;
}

const Attachment: React.FC<AttachmentProps> = ({ onFileChange, ...props }) => {
  return (
    <div className="flex items-center justify-between mt-3">
      <p>사진 등록</p>
      <input
        type="file"
        id={"attach-file-picture"}
        className="hidden"
        onChange={(e) => onFileChange(e)}
      />
      <label
        htmlFor={"attach-file-picture"}
        className="bg-lime-500 p-2 px-10 text-white rounded-xl hover:bg-lime-600 cursor-pointer"
      >
        파일 찾기
      </label>
    </div>
  );
};

export default Attachment;
