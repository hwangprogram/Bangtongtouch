package com.jisang.bangtong.dto.product;

import com.jisang.bangtong.dto.user.ProfileDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class ProductReturnDtoWIthProfile {

  ProductReturnDto productReturnDto;
  ProfileDto profileDto;
}
