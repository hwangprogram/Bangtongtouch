package com.jisang.bangtong.dto.region;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class RegionSearchDto {
  private String regionSido;
  private String regionGugun;
  private String regionDong;
}
