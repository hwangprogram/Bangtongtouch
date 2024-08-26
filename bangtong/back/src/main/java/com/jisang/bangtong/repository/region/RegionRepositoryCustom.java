package com.jisang.bangtong.repository.region;

import com.jisang.bangtong.dto.region.RegionDongDto;
import com.jisang.bangtong.dto.region.RegionGugunDto;
import com.jisang.bangtong.dto.region.RegionSidoDto;
import com.jisang.bangtong.model.region.Region;
import java.util.List;

public interface RegionRepositoryCustom {
  List<RegionSidoDto> searchSido();
  List<RegionGugunDto> searchGugun(String sido);
  List<RegionDongDto>searchDong(String area);
}
