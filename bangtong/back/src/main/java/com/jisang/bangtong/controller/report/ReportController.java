package com.jisang.bangtong.controller.report;

import com.jisang.bangtong.dto.common.ResponseDto;
import com.jisang.bangtong.dto.report.ReportDto;
import com.jisang.bangtong.model.report.Report;
import com.jisang.bangtong.repository.report.ReportRepository;
import com.jisang.bangtong.service.report.ReportService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    private final String SUCCESS = "success";
    private final String CLIENT_ERROR = "client_error";
    private final String SERVER_ERROR = "server_error";

    // 신고 전송
    @PostMapping
    public ResponseDto<Void> manageReport(@RequestBody Map<String, Object> map) {
        ReportDto reportDto = new ReportDto();
        reportDto.setReportTypeId((Integer) map.get("reportTypeId"));
        reportDto.setReportSubjectTypeId((Integer) map.get("reportSubjectTypeId"));
        reportDto.setContent((String) map.get("content"));
        reportDto.setSubjectId(Long.parseLong(String.valueOf(map.get("subjectId"))));

        Report report = reportService.manageReport(reportDto);

        if (report == null) {
            return ResponseDto.res(CLIENT_ERROR);
        }

        return ResponseDto.res(SUCCESS);
    }
}
