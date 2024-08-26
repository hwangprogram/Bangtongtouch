package com.jisang.bangtong.model.report;


import com.jisang.bangtong.model.board.Board;
import com.jisang.bangtong.model.product.Product;
import com.jisang.bangtong.model.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    //    TODO: 신고 유형 ID
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="report_type_id")
    private ReportType reportType;

    @Column(length = 100)
    private String reportContent;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "board_id")
    private Board board;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    @Temporal(value = TemporalType.TIMESTAMP)
    @CreationTimestamp
    @Column(nullable = false)
    private Date reportDate;

}