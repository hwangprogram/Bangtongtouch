package com.jisang.bangtong.dto.comment;

import jakarta.validation.constraints.Size;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.Singular;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class CommentDto {
  @Size(min = 1, max = 500)
  private String content;
  private Long parentId;
}
