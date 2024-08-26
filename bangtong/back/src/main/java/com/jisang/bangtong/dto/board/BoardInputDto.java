package com.jisang.bangtong.dto.board;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@RequiredArgsConstructor
public class BoardInputDto {
  String boardTitle;
  Long boardWriter;
  String boardContent;
}
