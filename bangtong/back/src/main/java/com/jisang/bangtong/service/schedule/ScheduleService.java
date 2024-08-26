package com.jisang.bangtong.service.schedule;

import com.jisang.bangtong.dto.schedule.ScheduleDto;
import com.jisang.bangtong.model.chatroom.Chatroom;
import com.jisang.bangtong.model.schedule.Schedule;
import com.jisang.bangtong.repository.chatroom.ChatroomRepository;
import com.jisang.bangtong.repository.schedule.ScheduleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ScheduleService {

  @Autowired
  private ScheduleRepository scheduleRepository;

  @Autowired
  private ChatroomRepository chatroomRepository;

  //예약 생성
  public void createSchedule(ScheduleDto scheduleDto) {
    Chatroom chatroom = chatroomRepository.findById(scheduleDto.getChatroomId()).orElse(null);

    Schedule schedule = new Schedule();
    schedule.setChatroom(chatroom);
    schedule.setScheduleDate(scheduleDto.getScheduleDate());

    scheduleRepository.save(schedule);
  }

  //예약 삭제
  public void deleteSchedule(long scheduleId) {
    scheduleRepository.deleteById(scheduleId);
  }

  //예약 목록 조회
  public List<ScheduleDto> scheduleList(long chatroomId) {
    List<ScheduleDto> resultDto = new ArrayList<>();
    List<Schedule> result = scheduleRepository.findAll();
    for (Schedule schedule : result) {
      ScheduleDto dto = new ScheduleDto();
      dto.setScheduleId(schedule.getScheduleId());
      dto.setChatroomId(schedule.getChatroom().getChatroomId());
      dto.setScheduleDate(schedule.getScheduleDate());
      resultDto.add(dto);
    }
    return resultDto;
  }

  //개별 예약 상세 조회
  public ScheduleDto individualSchedule(long scheduleId) {
    ScheduleDto dto = new ScheduleDto();

    try {
      Schedule result = scheduleRepository.findByScheduleId(scheduleId);

      if (result != null) {
        dto.setScheduleId(result.getScheduleId());
        dto.setChatroomId(result.getChatroom().getChatroomId());
        dto.setScheduleDate(result.getScheduleDate());
      }
    } catch (Exception e) {
      return null;
    }

    return dto;
  }

  // 예약 편집
  public ScheduleDto editSchedule(long scheduleId, ScheduleDto scheduleDto) {
    Schedule exisistingSchedule = scheduleRepository.findByScheduleId(scheduleId);

    exisistingSchedule.setScheduleDate(scheduleDto.getScheduleDate());

    Schedule updatedSchedule = scheduleRepository.save(exisistingSchedule);

    ScheduleDto updatesScheduleDto = new ScheduleDto();
    updatesScheduleDto.setScheduleDate(updatedSchedule.getScheduleDate());

    return updatesScheduleDto;
  }
}
