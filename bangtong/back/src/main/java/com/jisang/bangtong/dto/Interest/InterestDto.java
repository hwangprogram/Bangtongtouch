package com.jisang.bangtong.dto.Interest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class InterestDto {
  private Long userId;
  private Long productId;

}
