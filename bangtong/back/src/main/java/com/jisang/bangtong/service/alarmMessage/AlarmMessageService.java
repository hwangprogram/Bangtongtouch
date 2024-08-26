package com.jisang.bangtong.service.alarmMessage;

import com.jisang.bangtong.dto.alarmMessage.AlarmMessageDto;
import com.jisang.bangtong.model.alarmMessage.AlarmMessage;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.alarmMessage.AlarmMessageRepository;
import com.jisang.bangtong.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class AlarmMessageService {

  @Autowired
  private AlarmMessageRepository alarmMessageRepository;

  @Autowired
  private UserRepository userRepository;

  // 알림 목록 조회
  public List<AlarmMessageDto> alarmList(long userId) {
    List<AlarmMessageDto> resultDto = new ArrayList<>();
    List<AlarmMessage> result = alarmMessageRepository.findAllByUser_UserId(userId);

    for (AlarmMessage alarmMessage : result) {
      AlarmMessageDto dto = new AlarmMessageDto();
      dto.setAlarmMessageId(alarmMessage.getAlarmMessageId());
      dto.setUserId(alarmMessage.getUser().getUserId());
      String date = String.valueOf(alarmMessage.getAlarmMessageDate());
      String formatDate = date.substring(0, 16);
      dto.setAlarmMessageDate(formatDate);
      dto.setAlarmMessage(alarmMessage.getAlarmMessage());
      resultDto.add(dto);
    }
    return resultDto;
  }

  // 알림 삭제
  public void deleteAlarm(long alarmMessageId) {
    alarmMessageRepository.deleteById(alarmMessageId);
  }

  // 알림 생성
  public void createAlarm(AlarmMessageDto alarmMessageDto) {
    AlarmMessage alarmMessage = new AlarmMessage();
    User user = userRepository.findById(alarmMessageDto.getUserId()).orElse(null);
    alarmMessage.setUser(user);
    alarmMessage.setAlarmMessage(alarmMessageDto.getAlarmMessage());
    alarmMessageRepository.save(alarmMessage);
  }
}
