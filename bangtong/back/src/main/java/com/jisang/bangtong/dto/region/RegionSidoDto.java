package com.jisang.bangtong.dto.region;

import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class RegionSidoDto {
  private String regionId;
  private String regionSido;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true; // 참조가 동일할 경우
    if (!(o instanceof RegionSidoDto)) return false; // 다른 클래스 체크
    RegionSidoDto that = (RegionSidoDto) o; // 타입 변환
    return Objects.equals(regionId, that.getRegionId()) && // regionId 비교
        Objects.equals(regionSido, that.getRegionSido()); // regionSido 비교
  }

  // hashCode 메소드 오버라이드
  @Override
  public int hashCode() {
    return Objects.hash(regionId, regionSido); // regionId와 regionSido로 해시 코드 계산
  }
}
