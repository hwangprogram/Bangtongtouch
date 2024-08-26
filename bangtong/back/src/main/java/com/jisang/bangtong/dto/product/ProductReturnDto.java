package com.jisang.bangtong.dto.product;

import com.jisang.bangtong.dto.region.RegionReturnDto;
import com.jisang.bangtong.model.media.Media;
import com.jisang.bangtong.model.product.ProductType;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class ProductReturnDto {
  Long productId;
  ProductType productType;
  RegionReturnDto regionReturnDto;
  String productAddress;
  Integer productDeposit;
  Integer productRent;
  Integer productMaintenance;
  String productMaintenanceInfo;
  boolean productIsRentSupportable;
  boolean productIsFurnitureSupportable;
  Float productSquare;
  Integer productRoom;
  Integer productOption;
  List<String> productAdditionalOption;  // List로 변환할 필드
  boolean productIsBanned;
  Date productPostDate;
  Date productStartDate;
  Date productEndDate;
  Double lat;
  Double lng;
  String productAdditionalDetail;
  boolean productIsInterest;
  List<Media> mediaList;
  boolean productIsDelete;
  double score=0;
  // 생성자 추가
  public ProductReturnDto(
      Long productId,
      ProductType productType,
      RegionReturnDto regionReturnDto,
      String productAddress,
      Integer productDeposit,
      Integer productRent,
      Integer productMaintenance,
      String productMaintenanceInfo,
      boolean productIsRentSupportable,
      boolean productIsFurnitureSupportable,
      Float productSquare,
      Integer productRoom,
      Integer productOption,
      String productAdditionalOptionStr,
      boolean productIsBanned,
      Date productPostDate,
      Date productStartDate,
      Date productEndDate,
      Double lat,
      Double lng,
      String productAdditionalDetail,
      boolean productIsInterest,
      List<Media> mediaList,
      boolean productIsDelete) {
    this.productId = productId;
    this.productType = productType;
    this.regionReturnDto = regionReturnDto;
    this.productAddress = productAddress;
    this.productDeposit = productDeposit;
    this.productRent = productRent;
    this.productMaintenance = productMaintenance;
    this.productMaintenanceInfo = productMaintenanceInfo;
    this.productIsRentSupportable = productIsRentSupportable;
    this.productIsFurnitureSupportable = productIsFurnitureSupportable;
    this.productSquare = productSquare;
    this.productRoom = productRoom;
    this.productOption = productOption;
    this.productAdditionalOption = new ArrayList<>();
    // String to List 변환 로직 추가
    if (productAdditionalOptionStr != null && !productAdditionalOptionStr.isEmpty()) {
      this.productAdditionalOption = Arrays.asList(productAdditionalOptionStr.split(","));
    }
    this.productIsBanned = productIsBanned;
    this.productPostDate = productPostDate;
    this.productStartDate = productStartDate;
    this.productEndDate = productEndDate;
    this.lat = lat;
    this.lng = lng;
    this.productAdditionalDetail = productAdditionalDetail;
    this.productIsInterest = productIsInterest;
    this.mediaList = mediaList;
    this.productIsDelete = productIsDelete;
  }
}
