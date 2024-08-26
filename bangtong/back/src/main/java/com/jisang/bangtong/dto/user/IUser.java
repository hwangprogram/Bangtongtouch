package com.jisang.bangtong.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class IUser {
  Long userId;
  String nickname;
  Boolean isBanned;
}
