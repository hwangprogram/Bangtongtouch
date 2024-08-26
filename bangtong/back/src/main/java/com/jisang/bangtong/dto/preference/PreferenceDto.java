package com.jisang.bangtong.dto.preference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PreferenceDto {
    private Long preferenceId;
    private String preferenceName;
    private Long userId;
    private String regionId;
    private String regionAddress;
    private Integer preferenceDeposit;
    private Integer preferenceRent;
    private String preferenceType;
    private String preferenceInfra;
    private Date preferenceStartDate;
    private Date preferenceEndDate;
}
