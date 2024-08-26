package com.jisang.bangtong.model.alarmSetting;

import com.jisang.bangtong.dto.alarmsetting.AlarmSettingDto;
import com.jisang.bangtong.model.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlarmSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alarmId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean alarmPhoneChat;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean alarmPhoneComplete;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean alarmPhoneInterest;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean alarmEmailChat;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean alarmEmailComplete;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean alarmEmailInterest;

    public void updateAlarmSetting(Long userId, AlarmSettingDto settingDto) {
    }
}
