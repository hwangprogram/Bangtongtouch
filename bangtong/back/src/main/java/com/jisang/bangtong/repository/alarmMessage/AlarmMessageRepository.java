package com.jisang.bangtong.repository.alarmMessage;

import com.jisang.bangtong.model.alarmMessage.AlarmMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlarmMessageRepository extends JpaRepository<AlarmMessage, Long> {
    List<AlarmMessage> findAllByUser_UserId(long userId);
}
