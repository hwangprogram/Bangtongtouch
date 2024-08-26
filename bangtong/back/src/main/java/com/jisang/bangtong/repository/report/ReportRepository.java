package com.jisang.bangtong.repository.report;

import com.jisang.bangtong.model.report.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByUser_UserId(Long userId);

    int countByUser_UserId(Long userId);

//    List<Report> findByProduct_ProductId(int i);
    int countByProduct_ProductId(Long productId);
    int countByBoard_BoardId(Long boardId);
}