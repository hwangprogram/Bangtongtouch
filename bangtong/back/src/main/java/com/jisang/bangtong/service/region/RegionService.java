package com.jisang.bangtong.service.region;

import com.jisang.bangtong.dto.region.RegionDongDto;
import com.jisang.bangtong.dto.region.RegionGugunDto;
import com.jisang.bangtong.dto.region.RegionReturnDto;
import com.jisang.bangtong.dto.region.RegionSearchDto;
import com.jisang.bangtong.dto.region.RegionSidoDto;
import com.jisang.bangtong.model.region.Region;
import java.util.List;

public interface RegionService {
  List<RegionSidoDto> searchSido();
  List<RegionGugunDto> searchGugun(String sido);
  List<RegionDongDto> searchDong(String gugun);
  RegionReturnDto getRegionCode(String regionId);
}
