package com.jisang.bangtong.repository.report;

import com.jisang.bangtong.model.report.ReportType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportTypeRepository extends JpaRepository<ReportType, Integer> {
}
