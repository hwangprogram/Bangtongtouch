package com.jisang.bangtong.dto.region;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class RegionReturnDto {
  String regionId;
  String regionSido;
  String regionGugun;
  String regionDong;
}
