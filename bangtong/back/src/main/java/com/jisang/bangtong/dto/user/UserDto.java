package com.jisang.bangtong.dto.user;

import com.jisang.bangtong.model.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

  private Long id;
  private String email;
  private String provider;
  private String nickname;
  private String profileImage;

  public User toEntity() {
    return User.builder()
        .userNickname(nickname)
        .userEmail(email)
        .userProvider(provider)
        .build();
  }

}