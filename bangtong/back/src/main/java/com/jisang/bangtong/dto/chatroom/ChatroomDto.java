package com.jisang.bangtong.dto.chatroom;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
public class ChatroomDto {

  String title;
  Long maker;
  Long participant;
  Long productId;
}
