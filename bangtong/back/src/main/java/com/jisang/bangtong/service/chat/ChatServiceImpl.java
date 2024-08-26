package com.jisang.bangtong.service.chat;

import com.jisang.bangtong.dto.chat.SendDto;
import com.jisang.bangtong.model.chat.Chat;
import com.jisang.bangtong.model.chatroom.Chatroom;
import com.jisang.bangtong.model.media.Media;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.chat.ChatRepository;
import com.jisang.bangtong.repository.chatroom.ChatroomRepository;
import com.jisang.bangtong.repository.user.UserRepository;
import com.jisang.bangtong.service.common.FileService;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ChatServiceImpl implements ChatService {

  @Autowired
  ChatRepository chatRepository;

  @Autowired
  UserRepository userRepository;

  @Autowired
  ChatroomRepository chatroomRepository;

  @Autowired
  FileService fileService;

  List<Chat> chats = new ArrayList<>();

  @Override
  @Transactional
  public Chat send(SendDto sendDto) {
    Chat chat = new Chat();
    //사용자 가져오기
    Long senderId = sendDto.getSender();
    User sender = userRepository.findById(senderId).orElse(null);
    if (sender == null) {
      throw new RuntimeException("ChatServiceImpl send receiver and sender is null");
    } else {
      chat.setSender(sender);
    }

    //chatroom 가져오기
    Long chatRoomId = sendDto.getChatRoom();
    Chatroom chatroom = chatroomRepository.findById(chatRoomId).orElse(null);
    if (chatroom == null) {
      throw new RuntimeException("ChatServiceImpl chatroom is null");
    } else {  //chatroom이 형성되어 있으면
      chat.setChatRoom(chatroom);
    }
    chat.setChatContent(sendDto.getChatMessage());
    chat.setChatTime(sendDto.getChatTime());
    chats.add(chat);

    if (chats.size() > 1) {
      chatRepository.saveAllListChats(chats);
      chats.clear();
    }
    return chat;
  }

  @Override
  public List<Chat> getMessagesByRoom(Long roomId) {
    Optional<List<Chat>> chats = chatRepository.findByChatRoom_ChatroomId(roomId);
    if (chats.isPresent()) {
      return chats.get();
    } else {
      throw new RuntimeException("chatroom not found");
    }
  }

  @Override
  public void getOutOfRoom(Long roomId) {
    if (!chats.isEmpty()) {
      chatRepository.saveAllListChats(chats);
      chats.clear();
    }
  }
}
