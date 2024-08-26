package com.jisang.bangtong.model.preference;

import com.jisang.bangtong.model.region.Region;
import com.jisang.bangtong.model.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Preference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long preferenceId;

    @Column(nullable = false, length = 12)
    private String preferenceName;

    //TODO
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "region_id")
    private Region region;

    @Column
    private int preferenceDeposit;

    @Column
    private int preferenceRent;

    @Column(length = 5)
    private String preferenceType;

    @Column(length = 8)
    private String preferenceInfra;

    @Column(nullable = false)
    private Date preferenceStartDate;

    @Column(nullable = false)
    private Date preferenceEndDate;
}