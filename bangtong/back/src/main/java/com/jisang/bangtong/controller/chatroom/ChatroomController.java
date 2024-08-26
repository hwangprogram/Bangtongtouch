package com.jisang.bangtong.controller.chatroom;

import com.jisang.bangtong.dto.chat.ChatReturnDto;
import com.jisang.bangtong.dto.chatroom.ChatroomDto;
import com.jisang.bangtong.dto.chatroom.ChatroomExitDto;
import com.jisang.bangtong.dto.chatroom.ChatroomReturnDto;
import com.jisang.bangtong.dto.common.ResponseDto;
import com.jisang.bangtong.model.chatroom.Chatroom;
import com.jisang.bangtong.model.chatroom.UserChatroomId;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.user.UserRepository;
import com.jisang.bangtong.service.chatroom.ChatroomLog;
import com.jisang.bangtong.service.chatroom.ChatroomService;
import com.jisang.bangtong.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chatrooms")
public class ChatroomController {

  private final String SUCCESS = "success";
  private final String SERVER_ERROR = "server_error";
  private final String CLIENT_ERROR = "client_error";

  @Autowired
  private ChatroomService chatroomService;
  @Autowired
  private ChatroomLog chatroomLog;
  @Autowired
  private JwtUtil jwtUtil;
  @Autowired
  private UserRepository userRepository;

  @PostMapping("/save")
  public ResponseDto<Long> save(@RequestBody ChatroomDto chatroomDto) {
    Long chatroomId = chatroomService.createChatroom(chatroomDto);
    return ResponseDto.res(SUCCESS, chatroomId);
  }

  @GetMapping("/out/{chatroomId}")
  public ResponseDto<Void> out(@PathVariable Long chatroomId, HttpServletRequest request) {
    String token = jwtUtil.getAccessToken(request);
    if (token == null || token.isEmpty()) {
      throw new IllegalArgumentException(SERVER_ERROR);
    }
    Long userId = jwtUtil.getUserIdFromToken(token);
    User u = userRepository.findById(userId).orElse(null);
    if (u == null || (userId != u.getUserId())) {
      throw new IllegalArgumentException("올바른 사용자가 아닙니다.");
    }
    UserChatroomId userChatroomId = new UserChatroomId(userId, chatroomId);
    chatroomLog.enterOut(userChatroomId);
    return ResponseDto.res(SUCCESS);
  }

  @PutMapping("/end/{chatroomId}/{userId}")
  public ResponseDto<Void> end(@PathVariable Long chatroomId, @PathVariable Long uId,
      HttpServletRequest request) {
    String token = jwtUtil.getAccessToken(request);
    if (token == null || token.isEmpty()) {
      throw new IllegalArgumentException(SERVER_ERROR);
    }
    Long userId = jwtUtil.getUserIdFromToken(token);
    if (userId == null || !userId.equals(uId)) {
      throw new IllegalArgumentException("올바른 사용자가 아닙니다.");
    }
    chatroomService.exitChatroom(chatroomId, userId);

    return ResponseDto.res(SUCCESS);
  }

  @GetMapping("/{userId}")
  public ResponseDto<List<ChatroomReturnDto>> getrooms(@PathVariable Long userId) {
    List<ChatroomReturnDto> chatroomReturnDtoList = chatroomService.getChatroom(userId);
    return ResponseDto.res(SUCCESS, chatroomReturnDtoList);
  }

  @GetMapping("/chat/{chatroomId}")
  public ResponseDto<ChatReturnDto> getChats(@PathVariable Long chatroomId,
      HttpServletRequest request) {
    String token = jwtUtil.getAccessToken(request);
    if (token == null || token.isEmpty()) {
      throw new IllegalArgumentException("토큰이 유효하지 않습니다");
    }
    ChatReturnDto chatReturnDto = chatroomService.getChats(chatroomId);

    Long userId = jwtUtil.getUserIdFromToken(token);
    UserChatroomId userChatroomId = new UserChatroomId(userId, chatroomId);
    chatroomLog.enterIn(userChatroomId);

    return ResponseDto.res(SUCCESS, chatReturnDto);
  }
}
