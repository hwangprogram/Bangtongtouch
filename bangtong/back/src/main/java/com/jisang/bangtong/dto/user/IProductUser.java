package com.jisang.bangtong.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class IProductUser {
  Long userId;
  String profileImage;
  String nickname;
  boolean isBanned;
}
