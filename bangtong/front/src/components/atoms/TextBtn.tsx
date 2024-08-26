import { ConfigProvider, Input, Modal, Slider, SliderSingleProps } from "antd";
import React, { useEffect, useState } from "react";
import { productSearchStore } from "../../store/productStore";

interface TextBtnProps {
  title: string;
  text: string;
}

// ant design 글로벌 디자인 토큰
const theme = {
  token: {
    colorBgTextHover: "#E9FFE7",
    colorPrimary: "#129B07",
    colorPrimaryBorder: "#129B07",
  },
};

const TextBtn: React.FC<TextBtnProps> = ({ title, text }) => {
  let min = 0;
  let max = 3000;
  const { minDeposit, maxDeposit, minRent, maxRent, setDeposit, setRent } =
    productSearchStore();
  const [modalOpen, setModalOpen] = useState(false);
  if (title === "보증금") {
    min = minDeposit;
    max = maxDeposit;
  } else {
    min = minRent;
    max = maxRent;
  }
  const [sliderValue, setSliderValue] = useState<number[]>([min, max]);
  const [minInput, setMinInput] = useState<number>(min);
  const [maxInput, setMaxInput] = useState<number>(max);

  const rentalMarks: SliderSingleProps["marks"] = {
    0: "0",
    50: "50",
    100: "100",
    150: "150",
    200: "200",
    250: "250",
    300: "300",
  };

  const depositMarks: SliderSingleProps["marks"] = {
    0: "0",
    1000: "1000",
    2000: "2000",
    3000: "3000~",
  };

  // 슬라이더 조종 시 슬라이더 및 Input 값을 바꾸는 핸들러
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    setMinInput(value[0]);
    setMaxInput(value[1]);
  };

  // Input 직접 기입 시 슬라이더 위치를 변경하는 핸들러
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMinInput(value);
    setSliderValue([value, maxInput]);
  };

  // Input 직접 기입 시 슬라이더 위치를 변경하는 핸들러
  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMaxInput(value);
    setSliderValue([minInput, value]);
  };

  useEffect(() => {
    setSliderValue([min, max]);
    setMinInput(min);
    setMaxInput(max);
  }, [min, max]);

  return (
    <div className="flex justify-between mt-7">
      <p className="text-lime-600 font-bold">{title}</p>
      <button
        className={"dark:text-white font-bold text-gray-400"}
        onClick={() => setModalOpen(true)}
      >
        {text}
      </button>
      <ConfigProvider theme={theme}>
        <Modal
          title={`${title} 범위 설정 (단위: 만원)`}
          open={modalOpen}
          onOk={() => {
            // OK를 눌렀을 시 보증금 혹은 월세 조건을 설정하고 모달을 닫는 핸들러
            if (title === "보증금") {
              setDeposit(sliderValue[0], sliderValue[1]);
            } else {
              setRent(sliderValue[0], sliderValue[1]);
            }
            min = sliderValue[0];
            max = sliderValue[1];
            setModalOpen(false);
          }}
          onCancel={() => {
            setModalOpen(false);
            setSliderValue([min, max]);
          }}
        >
          <Slider
            range
            marks={title === "보증금" ? depositMarks : rentalMarks}
            defaultValue={[0, 3000]}
            min={0}
            max={title === "보증금" ? 3000 : 300}
            value={sliderValue}
            step={title === "보증금" ? 100 : 10}
            keyboard
            onChange={handleSliderChange}
          />
          <div className="flex">
            <Input
              placeholder="최소값 입력"
              value={minInput}
              onChange={handleMinInputChange}
              className="me-3"
            />
            <Input
              placeholder="최대값 입력"
              value={maxInput}
              onChange={handleMaxInputChange}
            />
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default TextBtn;
