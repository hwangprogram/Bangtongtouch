import { useState } from "react";
import menuImg from "../../assets/Menu.png";

interface MenuBtnProps {
  onEditClicked: () => void;
  onDeleteClicked: () => void;
}

const MenuBtn: React.FC<MenuBtnProps> = ({
  onEditClicked,
  onDeleteClicked,
}) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const changeIsClicked = () => {
    setIsClicked(!isClicked);
  };
  return (
    <div className="">
      {isClicked === false ? (
        <button className="w-10 rounded-xl mb-3" onClick={changeIsClicked}>
          <img src={menuImg} alt="" />
        </button>
      ) : (
        <div className="absolute right-10">
          <div className="flex flex-col text-center items-center h-full">
            <button className="border mx-1 text-center" onClick={onEditClicked}>
              수정
            </button>
            <button
              className="border mx-1 text-center"
              onClick={onDeleteClicked}
            >
              삭제
            </button>
            <button
              className="border mx-1 text-center"
              onClick={changeIsClicked}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuBtn;
