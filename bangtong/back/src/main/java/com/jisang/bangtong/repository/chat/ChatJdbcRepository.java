package com.jisang.bangtong.repository.chat;

import com.jisang.bangtong.model.chat.Chat;
import java.util.List;

public interface ChatJdbcRepository {

  void saveAllListChats(List<Chat> messages);
}
