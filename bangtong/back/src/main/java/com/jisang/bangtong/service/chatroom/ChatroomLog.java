package com.jisang.bangtong.service.chatroom;

import com.jisang.bangtong.model.chatroom.Chatroomlog;
import com.jisang.bangtong.model.chatroom.UserChatroomId;

public interface ChatroomLog {

  Chatroomlog enterIn(UserChatroomId userChatroomId);
  Chatroomlog enterOut(UserChatroomId userChatroomId);
}
