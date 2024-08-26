package com.jisang.bangtong.controller.alarmMessage;

import com.jisang.bangtong.dto.alarmMessage.AlarmMessageDto;
import com.jisang.bangtong.dto.common.ResponseDto;
import com.jisang.bangtong.service.alarmMessage.AlarmMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alarms")
public class AlarmMessageController {
    @Autowired
    private AlarmMessageService alarmMessageService;

    // 알림 목록 조회
    @GetMapping("/{userId}/list")
    private ResponseEntity<ResponseDto<List<AlarmMessageDto>>> alarmList(@PathVariable long userId) {
        List<AlarmMessageDto> messageList = alarmMessageService.alarmList(userId);
        return ResponseEntity.ok(ResponseDto.res("SUCCESS", messageList));
    }

    // 알림 삭제
    @DeleteMapping("/delete/{alarmMessageId}")
    public ResponseEntity<ResponseDto<Void>> deleteAlarm(@PathVariable long alarmMessageId) {
        alarmMessageService.deleteAlarm(alarmMessageId);

        return ResponseEntity.ok(ResponseDto.res("SUCCESS"));
    }

    // 알림 생성
    @PostMapping
    public ResponseDto<Void> createAlarm(@RequestBody AlarmMessageDto alarmMessageDto) {
        alarmMessageService.createAlarm(alarmMessageDto);

        return ResponseDto.res("SUCCESS");
    }

}
