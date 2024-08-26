package com.jisang.bangtong.service.common;

import com.jisang.bangtong.model.media.Media;
import java.io.IOException;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface FileService{
  List<Media> upload(List<Media> files) throws IOException;
  List<Media> getName(List<MultipartFile> files);
}
