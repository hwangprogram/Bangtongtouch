package com.jisang.bangtong.dto.Interest;

import com.jisang.bangtong.dto.product.ProductReturnDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class InterestReturnDto {
  Long interestId;
  ProductReturnDto productReturnDto;
}
