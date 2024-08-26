package com.jisang.bangtong.repository.chatroom;

import com.jisang.bangtong.dto.chat.ChatReturnDto;
import com.jisang.bangtong.dto.chatroom.ChatroomReturnDto;
import com.jisang.bangtong.model.chat.Chat;
import com.jisang.bangtong.model.chatroom.Chatroom;
import java.util.List;
import java.util.Optional;

public interface ChatroomRepositoryCustom {
  List<ChatroomReturnDto> getChatroom(Long userId);
  ChatReturnDto getChats(Long chatroomId);
}
