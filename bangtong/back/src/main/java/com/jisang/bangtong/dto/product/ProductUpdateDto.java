package com.jisang.bangtong.dto.product;

import com.jisang.bangtong.dto.common.FileDto;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class ProductUpdateDto {


  @NotBlank(message = "매물 정보가 없습니다")
  @NotNull
  private Long productId;

  @NotBlank(message="보증금을 입력해주세요")
  @NotNull
  @Min(value=0, message = "유효하지 않은 값입니다")
  private Integer productDeposit;

  @NotNull
  @NotBlank
  @Min(value=0, message="유효하지 않은 값입니다")
  private Integer productMaintenance;

  @NotNull(message="월세 지원여부를 선택해주세요")
  private Boolean productIsRentSupportable;
  @NotNull(message="가구 지원여부를 선택해주세요")
  private Boolean productIsFurnitureSupportable;
  private Integer productOption;
  private String productAdditionalOption;
  @NotNull(message = "거주를 시작할 수 있는 날짜를 입력해주세요")
  private Date productStartDate;
  @NotNull(message = "거주가 끝나는 날짜를 입력해주세요")
  private Date productEndDate;
  //TODO: 이미지 리스트 추가
  private List<FileDto> files;

}
