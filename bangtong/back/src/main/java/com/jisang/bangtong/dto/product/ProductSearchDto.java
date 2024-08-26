package com.jisang.bangtong.dto.product;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jisang.bangtong.model.product.ProductType;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class ProductSearchDto {
  int order=0;
  Integer minDeposit;
  Integer maxDeposit;
  String regionId;
  Integer minRent;
  Integer maxRent;
  ProductType type;
  Boolean rentSupportable;
  Boolean furnitureSupportable;
  Integer infra;
  @Temporal(TemporalType.DATE)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  Date startDate;
  @Temporal(TemporalType.DATE)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  Date endDate;
}
