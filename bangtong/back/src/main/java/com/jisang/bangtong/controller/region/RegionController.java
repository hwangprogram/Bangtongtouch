package com.jisang.bangtong.controller.region;

import com.jisang.bangtong.dto.common.ResponseDto;
import com.jisang.bangtong.dto.region.RegionDongDto;
import com.jisang.bangtong.dto.region.RegionGugunDto;
import com.jisang.bangtong.dto.region.RegionReturnDto;
import com.jisang.bangtong.dto.region.RegionSearchDto;
import com.jisang.bangtong.dto.region.RegionSidoDto;
import com.jisang.bangtong.model.region.Region;
import com.jisang.bangtong.service.region.RegionService;

import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/regions")
public class RegionController {

  private final String SUCCESS = "success";
  private final String SERVER_ERROR = "server_error";
  private final String CLIENT_ERROR = "client_error";

  @Autowired
  private RegionService regionService;

  @GetMapping
  public ResponseEntity<ResponseDto<List<RegionSidoDto>>> searchSido() {
    List<RegionSidoDto> regions = regionService.searchSido();

    if (regions == null) {
      return ResponseEntity.ok(ResponseDto.res(CLIENT_ERROR));
    } else {
      return ResponseEntity.ok(ResponseDto.res(SUCCESS, regions));
    }
  }

  @GetMapping("/{sido}")
  public ResponseEntity<ResponseDto<List<RegionGugunDto>>> searchGugun(@PathVariable String sido) {
    List<RegionGugunDto> regions = regionService.searchGugun(sido);

    if (regions == null) {
      return ResponseEntity.ok(ResponseDto.res(CLIENT_ERROR));
    } else {
      return ResponseEntity.ok(ResponseDto.res(SUCCESS, regions));
    }
  }

  @GetMapping("/gugun/{gugun}")
  public ResponseEntity<ResponseDto<List<RegionDongDto>>> searchSido(@PathVariable String gugun) {
    List<RegionDongDto> regions = regionService.searchDong(gugun);
    if (regions == null) {
      return ResponseEntity.ok(ResponseDto.res(CLIENT_ERROR));
    } else {
      return ResponseEntity.ok(ResponseDto.res(SUCCESS, regions));
    }
  }

  @GetMapping("/search/{regionId}")
  public ResponseDto<RegionReturnDto> getRegionCode(@PathVariable String regionId) {
    try {
      RegionReturnDto returnDto = regionService.getRegionCode(regionId);
      return ResponseDto.res("SUCCESS", returnDto);
    } catch (IllegalArgumentException e) {
      String s = "데이터를 찾을 수 없습니다.";
      return ResponseDto.res("FAIL");
    }
  }


}
