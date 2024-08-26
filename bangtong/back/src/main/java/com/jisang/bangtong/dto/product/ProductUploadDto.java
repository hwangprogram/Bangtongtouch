package com.jisang.bangtong.dto.product;

import com.jisang.bangtong.model.product.ProductType;
import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class ProductUploadDto {
  private ProductType productType;
  private String regionId;
  private String productAddress;
  private int productDeposit;
  private int productRent;
  private int productMaintenance;
  private String productMaintenanceInfo;
  private boolean productIsRentSupportable;
  private boolean productIsFurnitureSupportable;
  private float productSquare;
  private int productRoom;
  private Integer productOption;
  private List<String> productAdditionalOption;
  private Date productPostDate;
  private Date productStartDate;
  private Date productEndDate;
  private double lat; // 위도
  private double lng; //경도
  private String productDetailAddress;
  private String productDescription;
}
