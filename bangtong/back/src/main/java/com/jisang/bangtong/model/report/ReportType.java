package com.jisang.bangtong.model.report;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int reportTypeId;

    @Column(nullable = false, length = 13)
    private String reportTypeTitle;
}