package com.jisang.bangtong.service.alarmsetting;

import com.jisang.bangtong.dto.alarmsetting.AlarmSettingDto;
import com.jisang.bangtong.model.alarmSetting.AlarmSetting;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.alarmsetting.AlarmSettingRepository;
import com.jisang.bangtong.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AlarmSettingService {

  @Autowired
  private AlarmSettingRepository alarmSettingRepository;
  @Autowired
  private UserRepository userRepository;

  // 알림 권한 설정
  public void updateAlarmSetting(Long userId, AlarmSettingDto alarmSettingDto) {
    User user = userRepository.findById(userId).orElse(null);

    Optional<AlarmSetting> alarmSettings = alarmSettingRepository.findByUser_UserId(userId);
    AlarmSetting setting;

    if (alarmSettings.isEmpty()) {
      // 알림 설정이 없는 경우 새로 생성
      setting = new AlarmSetting();
      setting.setUser(user);  // 연관 유저 설정
    } else {
      // 알림 설정이 있는 경우 기존 설정 사용
      setting = alarmSettings.get();
    }

    setting.setAlarmPhoneChat(alarmSettingDto.isAlarmPhoneChat());
    setting.setAlarmPhoneComplete(alarmSettingDto.isAlarmPhoneComplete());
    setting.setAlarmEmailInterest(alarmSettingDto.isAlarmEmailInterest());
    setting.setAlarmEmailComplete(alarmSettingDto.isAlarmEmailComplete());
    setting.setAlarmEmailChat(alarmSettingDto.isAlarmEmailChat());
    setting.setAlarmId(alarmSettingDto.getAlarmId());
//        setting.setUserId(alarmSettingDto.getUserId());
    setting.setAlarmPhoneInterest(alarmSettingDto.isAlarmPhoneInterest());
    alarmSettingRepository.save(setting);
  }

  // 알림 권한 조회
  public List<AlarmSettingDto> alarmAuthorize(Long userId) {
    List<AlarmSettingDto> resultSettingDto = new ArrayList<>();
    List<AlarmSetting> resultSetting = alarmSettingRepository.findAll();

    for (AlarmSetting setting : resultSetting) {
      AlarmSettingDto dto = new AlarmSettingDto();
      dto.setAlarmId(setting.getAlarmId());
      dto.setUserId(setting.getUser().getUserId());
      dto.setAlarmPhoneChat(setting.isAlarmPhoneChat());
      dto.setAlarmPhoneComplete(setting.isAlarmPhoneComplete());
      dto.setAlarmPhoneInterest(setting.isAlarmPhoneInterest());
      dto.setAlarmEmailInterest(setting.isAlarmEmailInterest());
      dto.setAlarmEmailChat(setting.isAlarmEmailChat());
      resultSettingDto.add(dto);
    }
    return resultSettingDto;

  }

}
