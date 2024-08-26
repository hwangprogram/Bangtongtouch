package com.jisang.bangtong.dto.schedule;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleDto {
    private Long scheduleId;
    private Long chatroomId;
    private Date scheduleDate;
}
