package com.jisang.bangtong.dto.board;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jisang.bangtong.dto.user.IUser;
import com.jisang.bangtong.model.region.Region;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class BoardReturnDto {
  Long boardId;
  String boardTitle;
  String boardContent;
  IUser boardWriter;
  Region region;
  int hit;
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSS")
  @Temporal(TemporalType.TIMESTAMP)
  Date boardDate;
  boolean boardIsBanned;
}
