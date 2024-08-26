package com.jisang.bangtong.repository.file;

import com.jisang.bangtong.model.media.Media;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<Media, Long> {

    List<Media> findByProduct_ProductId(Long productId);

}
