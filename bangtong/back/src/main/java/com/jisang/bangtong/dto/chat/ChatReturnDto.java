package com.jisang.bangtong.dto.chat;
import com.jisang.bangtong.dto.user.ProfileDto;
import com.jisang.bangtong.model.user.User;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class ChatReturnDto {
  ProfileDto participant;
  ProfileDto maker;
  List<ChatContentDto> content;
}
