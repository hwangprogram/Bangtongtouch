package com.jisang.bangtong.dto.alarmsetting;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlarmSettingDto {
    private Long alarmId;
    private Long userId;
    private boolean alarmPhoneChat;
    private boolean alarmPhoneComplete;
    private boolean alarmPhoneInterest;
    private boolean alarmEmailChat;
    private boolean alarmEmailComplete;
    private boolean alarmEmailInterest;
}
