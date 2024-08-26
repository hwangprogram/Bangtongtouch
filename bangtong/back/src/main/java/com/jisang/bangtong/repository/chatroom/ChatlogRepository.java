package com.jisang.bangtong.repository.chatroom;

import com.jisang.bangtong.model.chatroom.Chatroomlog;
import com.jisang.bangtong.model.chatroom.UserChatroomId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatlogRepository extends JpaRepository<Chatroomlog, UserChatroomId> {

}
