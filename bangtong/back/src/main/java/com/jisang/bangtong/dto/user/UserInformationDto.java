package com.jisang.bangtong.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInformationDto {

  private Long userId;
  private String email;
  private String password;
  private String nickname;
  private String profileImage;
  private String phone;

}