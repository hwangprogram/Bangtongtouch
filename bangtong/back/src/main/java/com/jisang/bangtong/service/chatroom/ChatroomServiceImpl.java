package com.jisang.bangtong.service.chatroom;

import com.amazonaws.services.kms.model.NotFoundException;
import com.jisang.bangtong.dto.chat.ChatReturnDto;
import com.jisang.bangtong.dto.chatroom.ChatroomDto;
import com.jisang.bangtong.dto.chatroom.ChatroomReturnDto;
import com.jisang.bangtong.model.chatroom.Chatroom;
import com.jisang.bangtong.model.product.Product;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.chatroom.ChatroomRepository;
import com.jisang.bangtong.repository.product.ProductRepository;
import com.jisang.bangtong.repository.user.UserRepository;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatroomServiceImpl implements ChatroomService {

  @Autowired
  private ChatroomRepository chatroomRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ProductRepository productRepository;


  public Long createChatroom(ChatroomDto roomName) {

    User maker = userRepository.findById(roomName.getMaker()).orElse(null);
    User participant = userRepository.findById(roomName.getParticipant()).orElse(null);
    Product product = productRepository.findById(roomName.getProductId()).orElse(null);

    if (!isValidUser(maker)) {
      throw new IllegalArgumentException("판매자 정보가 올바르지 않습니다");
    }

    if (!isValidUser(participant)) {
      throw new IllegalArgumentException("승계자 정보가 올바르지 않습니다");
    }

    if (!isVaildProduct(product)) {
      throw new NotFoundException("상품 정보를 찾을 수 없습니다");
    }

    ZonedDateTime koreanTime = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
    Date koreanDate = Date.from(koreanTime.toInstant());

    Chatroom chatroom = Chatroom.builder()
        .chatroomTitle(roomName.getTitle())
        .product(product)
        .Maker(maker)
        .Participant(participant)
        .chatroomMakerIsOut(false)
        .chatroomMakerIsOut(false)
        .chatroomCreatedAt(koreanDate)
        .build();
    Chatroom chatrooms = chatroomRepository.save(chatroom);
    return chatrooms.getChatroomId();
  }

  public void exitChatroom(Long chatroomId, Long userId) {
    Optional<Chatroom> chatroom = chatroomRepository.findById(chatroomId);
    if (chatroom.isPresent()) {
      Chatroom chatroomGet = chatroom.get();

      if (chatroomGet.getMaker().getUserId().equals(userId)) {
        chatroomGet.setChatroomMakerIsOut(true);
      }

      if (chatroomGet.getParticipant().getUserId().equals(userId)) {
        chatroomGet.setChatroomParticipantIsOut(true);
      }

      chatroomRepository.save(chatroomGet);
    }
  }

  @Override
  public List<ChatroomReturnDto> getChatroom(Long userId) {
    if (!userRepository.findById(userId).isPresent()) {
      throw new NotFoundException("사용자가 없습니다");
    }
    return chatroomRepository.getChatroom(userId);
  }

  @Override
  public ChatReturnDto getChats(Long chatroomId) {
    if (!chatroomRepository.findById(chatroomId).isPresent()) {
      throw new NotFoundException("채팅방이 존재하지 않습니다");
    }

    return chatroomRepository.getChats(chatroomId);
  }

  private boolean isVaildProduct(Product p) {
    if (p == null) {
      return false;
    }
    return true;
  }

  private boolean isValidUser(User u) {
    if (u == null) {
      return false;
    }
    return true;
  }

}
