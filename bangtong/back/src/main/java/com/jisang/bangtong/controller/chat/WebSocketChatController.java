package com.jisang.bangtong.controller.chat;

import com.jisang.bangtong.dto.chat.SendDto;
import com.jisang.bangtong.dto.common.ResponseDto;
import com.jisang.bangtong.service.chat.ChatService;
import java.text.SimpleDateFormat;
import java.util.Map;
import java.util.TimeZone;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

@RestController
public class WebSocketChatController {

  private final SimpMessagingTemplate messagingTemplate;

  @Autowired
  private final ChatService chatService;

  public WebSocketChatController(SimpMessagingTemplate messagingTemplate, ChatService chatService) {
    this.messagingTemplate = messagingTemplate;
    this.chatService = chatService;
  }

  @MessageMapping("/hello/{ChatroomId}")  //받는 데
  @SendTo("/topic/greetings/{ChatroomId}")    //보내는곳
  public ResponseDto<String> greeting(@RequestBody Map<String, Object> chatdto) {
    Map<String, String> chat = (Map<String, String>) chatdto.get("chat");

    SendDto sendDto = new SendDto();
    sendDto.setSender(Long.valueOf(String.valueOf(chat.get("sender"))));
    sendDto.setChatRoom(Long.valueOf(String.valueOf(chat.get("chatRoom"))));

    // HTML 엔티티 디코딩 적용
    String decodedMessage = decodeHtmlEntities(String.valueOf(chat.get("chatContent")));
    sendDto.setChatMessage(decodedMessage);

    //sendDto.get
    try {
      chatService.send(sendDto);
      SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
      formatter.setTimeZone(TimeZone.getTimeZone("Asia/Seoul"));
      JSONObject jsonObject = new JSONObject();
      jsonObject.put("chatRoom", sendDto.getChatRoom());
      jsonObject.put("sender", sendDto.getSender());
      jsonObject.put("chatMessage",
          HtmlUtils.htmlEscape(sendDto.getChatMessage())); // escapes HTML characters
      jsonObject.put("chatTime", formatter.format(sendDto.getChatTime()));

// Convert the JSONObject to a string
      String responseData = jsonObject.toString();
      return new ResponseDto<>("SUCCESS", responseData);
    } catch (RuntimeException e) {
      return new ResponseDto<>("ERROR", HtmlUtils.htmlEscape(decodeHtmlEntities(e.getMessage())));
    }

  }

  public String decodeHtmlEntities(String input) {
    return input.replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&")
        .replace("&quot;", "\"").replace("&#39;", "'");
  }
}
