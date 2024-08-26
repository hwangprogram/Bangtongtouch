package com.jisang.bangtong.service.chatroom;

import com.jisang.bangtong.dto.chat.ChatReturnDto;
import com.jisang.bangtong.dto.chatroom.ChatroomDto;
import com.jisang.bangtong.dto.chatroom.ChatroomExitDto;
import com.jisang.bangtong.dto.chatroom.ChatroomReturnDto;
import com.jisang.bangtong.model.chatroom.Chatroom;
import java.util.List;

public interface ChatroomService{

  Long createChatroom(ChatroomDto chatroomDto);
  void exitChatroom(Long chatroomIId, Long userId);
  List<ChatroomReturnDto> getChatroom(Long userId);
  ChatReturnDto getChats(Long chatroomId);
}
