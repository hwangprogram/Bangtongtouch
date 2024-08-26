package com.jisang.bangtong.repository.chatroom;

import com.jisang.bangtong.model.chatroom.Chatroom;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatroomRepository extends JpaRepository<Chatroom,Long>, ChatroomRepositoryCustom {
}
