package com.jisang.bangtong.service.chatroom;

import com.jisang.bangtong.model.chatroom.Chatroom;
import com.jisang.bangtong.model.chatroom.Chatroomlog;
import com.jisang.bangtong.model.chatroom.UserChatroomId;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.chatroom.ChatlogRepository;
import com.jisang.bangtong.repository.chatroom.ChatroomRepository;
import com.jisang.bangtong.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatroomLogImpl implements ChatroomLog {

  @Autowired
  ChatlogRepository chatlogRepository;

  @Autowired
  UserRepository userRepository; // User 엔티티를 조회하기 위해 추가

  @Autowired
  ChatroomRepository chatroomRepository; // Chatroom 엔티티를 조회하기 위해 추가

  @Override
  public Chatroomlog enterIn(UserChatroomId userChatroomId) {
    return updateChatroomLog(userChatroomId, true);
  }

  @Override
  public Chatroomlog enterOut(UserChatroomId userChatroomId) {
    return updateChatroomLog(userChatroomId, false);
  }

  private Chatroomlog updateChatroomLog(UserChatroomId userChatroomId, boolean isEntering) {
    User user = userRepository.findById(userChatroomId.getUserId())
        .orElseThrow(() -> new EntityNotFoundException("User not found"));
    Chatroom chatroom = chatroomRepository.findById(userChatroomId.getChatroomId())
        .orElseThrow(() -> new EntityNotFoundException("Chatroom not found"));

    Chatroomlog chatroomlog = chatlogRepository.findById(userChatroomId)
        .orElse(new Chatroomlog(user, chatroom));

    ZonedDateTime koreanTime = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
    Date koreanDate = Date.from(koreanTime.toInstant());

    if (isEntering) {
      chatroomlog.setLastIn(koreanDate);
    } else {
      chatroomlog.setLastOut(koreanDate);
    }

    return chatlogRepository.save(chatroomlog);
  }

}
