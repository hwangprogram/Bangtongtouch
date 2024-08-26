package com.jisang.bangtong.dto.board;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class BoardSearchDto {
  private String regionId;
  private Integer pageNo;
  private Integer size;
  private String keyword;
}
