package com.jisang.bangtong.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileDto {

  private Long userId;
  private String profileImage;
  private String nickname;

}