package com.jisang.bangtong.repository.schedule;

import com.jisang.bangtong.model.chatroom.Chatroom;
import com.jisang.bangtong.model.schedule.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
//    List<Schedule> findAllByChatroomId(Long chatroomId);
    Schedule findByScheduleId(Long scheduleId);

}
