package com.jisang.bangtong.controller.alarmsetting;


import com.jisang.bangtong.dto.alarmsetting.AlarmSettingDto;
import com.jisang.bangtong.dto.common.ResponseDto;
import com.jisang.bangtong.model.alarmSetting.AlarmSetting;
import com.jisang.bangtong.service.alarmsetting.AlarmSettingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.juli.logging.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alarms")
@RequiredArgsConstructor
public class AlarmSettingController {

  @Autowired
  private AlarmSettingService alarmSettingService;

  // 알림 권한 설정
  @PutMapping("/setting/modify/{userId}")
  public ResponseEntity<ResponseDto<Void>> updateAlarmSetting(@PathVariable("userId") Long userId,
      @RequestBody AlarmSettingDto settingDto) {
    alarmSettingService.updateAlarmSetting(userId, settingDto);
    return ResponseEntity.ok(ResponseDto.res("SUCCESS"));
  }

  // 알림 권한 조회
  @GetMapping("/setting/{userId}")
  private ResponseEntity<ResponseDto<List<AlarmSettingDto>>> alarmAuthorize(
      @PathVariable long userId) {
    List<AlarmSettingDto> settingList = alarmSettingService.alarmAuthorize(userId);
    return ResponseEntity.ok(ResponseDto.res("SUCCESS", settingList));
  }
}
