import React from "react";

// 컴포넌트
import ToggleBtn from "../atoms/ToggleBtn";

// 알람 설정 interface
interface UserAlarmSetting {
  alarmPhoneChat: boolean;
  alarmPhoneComplete: boolean;
  alarmPhoneInterest: boolean;
  alarmEmailChat: boolean;
  alarmEmailInterest: boolean;
  alarmEmailComplete: boolean;
  setAlarmToggle: (
    alarm: keyof Omit<UserAlarmSetting, "setTotalAlarm" | "setAlarmToggle">
  ) => void;
}

interface ToggleProps {
  text: string;
  buttonId: keyof Omit<UserAlarmSetting, "setTotalAlarm" | "setAlarmToggle">;
}

const ToggleBox: React.FC<ToggleProps> = ({ text, buttonId, ...props }) => {
  // toggleBtn에서의 값을 이용

  return (
    <div className="flex text-sm text-nowrap items-center justify-between mt-3">
      <p>{text}</p>
      <div>
        <ToggleBtn buttonId={buttonId} />
      </div>
    </div>
  );
};

export default ToggleBox;
