package com.jisang.bangtong.controller.common;

import com.jisang.bangtong.dto.common.FileDto;
import com.jisang.bangtong.dto.common.ResponseDto;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/files")
public class FileController {

  private final String uploadPath = System.getProperty("user.dir");

  @PostMapping("/upload")
  public ResponseDto<List<FileDto>> upload(MultipartFile[] files) {
    List<FileDto> list = new ArrayList<>();

    for (MultipartFile file : files) {
      String originalFilename = file.getOriginalFilename();
      assert originalFilename != null;
      String fileName = originalFilename.substring(originalFilename.lastIndexOf("\\") + 1);

      String folderPath = makeFolder();
      String uuid = UUID.randomUUID().toString();
      String saveName =
          uploadPath + File.separator + folderPath + File.separator + uuid + "_" + fileName;
      Path savePath = Paths.get(saveName);

      try {
        file.transferTo(savePath);
        list.add(new FileDto(fileName, uuid, folderPath));
      } catch (IOException e) {
        e.printStackTrace();
      }
    }

    return ResponseDto.res("success", list);
  }

  private String makeFolder() {
    String s = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));

    String folderPath = s.replace("/", File.separator);

    File uploadFolder = new File(uploadPath, folderPath);

    if (!uploadFolder.exists()) {
      boolean mkdirs = uploadFolder.mkdirs();
    }

    return folderPath;
  }

}