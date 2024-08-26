package com.jisang.bangtong.dto.chat;

import com.jisang.bangtong.dto.user.ProfileDto;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Builder
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class ChatDto {
  Long chatRoom;
  ProfileDto sender;
  String chatMessage;
  Date chatTime;
}
