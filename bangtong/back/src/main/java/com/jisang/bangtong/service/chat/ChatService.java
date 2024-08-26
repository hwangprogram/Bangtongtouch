package com.jisang.bangtong.service.chat;

import com.jisang.bangtong.dto.chat.SendDto;
import com.jisang.bangtong.model.chat.Chat;
import java.util.List;

public interface ChatService {

  Chat send(SendDto chatDto);

  List<Chat> getMessagesByRoom(Long roomId);

  void getOutOfRoom(Long roomId);
}
