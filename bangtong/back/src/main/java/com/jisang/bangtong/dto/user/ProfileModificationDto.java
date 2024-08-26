package com.jisang.bangtong.dto.user;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileModificationDto {

  private Long userId;
  private String nickname;
  private List<MultipartFile> profileImage;

}