package com.jisang.bangtong.repository.chat;

import com.jisang.bangtong.model.chat.Chat;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat, Long>, ChatJdbcRepository {

  Optional<List<Chat>> findByChatRoom_ChatroomId(Long roomId);
}
