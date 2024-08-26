package com.jisang.bangtong.dto.chatroom;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class ChatroomExitDto {

  Long makerId;
  Long participantId;
}
