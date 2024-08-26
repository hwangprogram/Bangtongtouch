package com.jisang.bangtong.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportDto {
    private int reportSubjectTypeId;
    private int reportTypeId;
    private String content;
    private Long subjectId;
}