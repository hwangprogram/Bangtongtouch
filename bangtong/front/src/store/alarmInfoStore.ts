import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AlarmI {
  alarmMessageId: number;
  userId: number;
  alarmMessageDate: string;
  alarmMessage: string;
}

interface alarm {
  alarmNum: number;
  alarms: Array<AlarmI> | null;
  setAlarmUpdate: (alarmNum: number, alarms: Array<AlarmI>) => void;
  setAlarmDelete: () => void;
}

const userPersistOptions = {
  name: "alarm-storage",
  getStorage: () => localStorage,
};

const useAlarmInfoStore = create<alarm>()(
  persist(
    (set) => ({
      alarmNum: 0,
      alarms: null,
      setAlarmUpdate: (alarmNum, alarms) => {
        set(() => ({ alarmNum, alarms }));
      },
      setAlarmDelete: () => {
        set({ alarmNum: 0, alarms: null });
      },
    }),
    userPersistOptions
  )
);

export default useAlarmInfoStore;
