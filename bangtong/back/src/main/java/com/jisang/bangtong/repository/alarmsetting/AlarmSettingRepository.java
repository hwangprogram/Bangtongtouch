package com.jisang.bangtong.repository.alarmsetting;

import com.jisang.bangtong.model.alarmSetting.AlarmSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlarmSettingRepository extends JpaRepository<AlarmSetting, Long> {
    Optional<AlarmSetting> findByUser_UserId(Long userId);
}