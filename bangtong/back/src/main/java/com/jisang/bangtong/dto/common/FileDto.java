package com.jisang.bangtong.dto.common;

import java.io.Serializable;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileDto implements Serializable {

  private String fileName;
  private String uuid;
  private String folderPath;

  public String getFileUrl() {
    return URLEncoder.encode(folderPath + "/" + uuid + "_" + fileName, StandardCharsets.UTF_8);
  }

}
