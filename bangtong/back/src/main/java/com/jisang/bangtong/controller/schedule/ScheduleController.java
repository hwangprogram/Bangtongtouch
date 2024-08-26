package com.jisang.bangtong.controller.schedule;

import com.jisang.bangtong.dto.common.ResponseDto;
import com.jisang.bangtong.dto.schedule.ScheduleDto;
import com.jisang.bangtong.service.schedule.ScheduleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedules")
public class ScheduleController {

  @Autowired
  private ScheduleService scheduleService;

  private final String SUCCESS = "success";
  private final String CLIENT_ERROR = "client_error";
  private final String SERVER_ERROR = "server_error";

  // 예약 생성
  @PostMapping("/add")
  public ResponseDto<Void> createSchedule(@RequestBody ScheduleDto scheduleDto) {
    scheduleService.createSchedule(scheduleDto);
    return ResponseDto.res("SUCCESS");
  }

  //예약 삭제
  @DeleteMapping("/delete/{scheduleId}")
  public ResponseEntity<ResponseDto<Void>> deleteSchedule(@PathVariable long scheduleId) {
    scheduleService.deleteSchedule(scheduleId);
    return ResponseEntity.ok(ResponseDto.res("SUCCESS"));
  }

  //예약 목록 조회
  @GetMapping("/list/{chatroomId}")
  public ResponseEntity<ResponseDto<List<ScheduleDto>>> scheduleList(
      @PathVariable long chatroomId) {
    List<ScheduleDto> scheduleDtoList = scheduleService.scheduleList(chatroomId);
    return ResponseEntity.ok(ResponseDto.res("SUCCESS", scheduleDtoList));
  }

  //개별 예약 상세 조회
  @GetMapping("/schedule/{scheduleId}")
  public ResponseEntity<ResponseDto<ScheduleDto>> individualSchedule(
      @PathVariable long scheduleId) {
    ScheduleDto scheduleDto = scheduleService.individualSchedule(scheduleId);
    if (scheduleDto != null) {
      if (scheduleDto.getScheduleId() != null) {
        return ResponseEntity.ok(ResponseDto.res(SUCCESS, scheduleDto));
      } else {
        return ResponseEntity.ok(ResponseDto.res(CLIENT_ERROR));
      }
    } else {
      return ResponseEntity.ok(ResponseDto.res(SERVER_ERROR));
    }
  }

  //예약 편집
  @PutMapping("/modify/{scheduleId}")
  public ResponseEntity<ResponseDto<ScheduleDto>> editSchedule(@PathVariable long scheduleId,
      @RequestBody ScheduleDto scheduleDto) {
    ScheduleDto modifySchedule = scheduleService.editSchedule(scheduleId, scheduleDto);

    return ResponseEntity.ok(ResponseDto.res(SUCCESS));
  }
}
