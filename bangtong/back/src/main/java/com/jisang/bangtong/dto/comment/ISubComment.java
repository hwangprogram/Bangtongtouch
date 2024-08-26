package com.jisang.bangtong.dto.comment;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jisang.bangtong.dto.user.IUser;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class ISubComment {
  Long commentId;
  IUser IUser;
  String content;
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSS")
  Date commentDate;
  boolean isDeleted;
}
