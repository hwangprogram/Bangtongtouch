package com.jisang.bangtong.dto.chatroom;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jisang.bangtong.dto.product.ProductReturnDto;
import com.jisang.bangtong.dto.user.IUser;
import com.jisang.bangtong.dto.user.ProfileDto;
import com.jisang.bangtong.model.product.Product;
import com.jisang.bangtong.model.user.User;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Data
@RequiredArgsConstructor
@Slf4j
public class ChatroomReturnDto {
  Long chatroomId;
  ProductReturnDto productReturnDto;
  ProfileDto profileDto;
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSS")
  @Temporal(TemporalType.TIMESTAMP)
  Date chatroomCreatedAt;

  // 명시적 생성자
  public ChatroomReturnDto(Long chatroomId, ProductReturnDto productReturnDto, ProfileDto profileDto, Date chatroomCreatedAt) {
    this.chatroomId = chatroomId;
    this.productReturnDto = productReturnDto;
    this.profileDto = profileDto;
    this.chatroomCreatedAt = chatroomCreatedAt;
  }
}
