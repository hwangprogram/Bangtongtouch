package com.jisang.bangtong.service.interest;

import com.jisang.bangtong.dto.Interest.InterestDto;
import com.jisang.bangtong.dto.Interest.InterestReturnDto;
import com.jisang.bangtong.dto.product.ProductReturnDto;
import com.jisang.bangtong.dto.region.RegionReturnDto;
import com.jisang.bangtong.model.interest.Interest;
import com.jisang.bangtong.model.product.Product;
import com.jisang.bangtong.model.region.Region;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.interest.InterestRepository;
import com.jisang.bangtong.repository.product.ProductRepository;
import com.jisang.bangtong.repository.user.UserRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import javax.swing.text.html.Option;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InterestServiceImpl implements InterestService {

  @Autowired
  private InterestRepository interestRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ProductRepository productRepository;


  @Override
  public void add(InterestDto interestDto) {
    Interest interest = new Interest();

    //user 객체 얻기
    Optional<User> user = userRepository.findById(interestDto.getUserId());

    //product 객체 얻기
    Optional<Product> product = productRepository.findById(interestDto.getProductId());

    if (user.isPresent() &&
        product.isPresent()) {
      interest.setUser(user.get());
      interest.setProduct(product.get());
      interestRepository.save(interest);
    } else {
      throw new RuntimeException("user or product not found");
    }
  }

  @Override
  public void delete(InterestDto interestDto) {
    interestRepository.deleteByUserIdAndProductId(interestDto.getUserId(),
        interestDto.getProductId());
  }

  @Override
  public List<InterestReturnDto> getList(Long userId) {
    List<Interest> interests = interestRepository.findAllByUser_UserId(userId).orElse(null);
    List<InterestReturnDto> interestReturnDtos = new ArrayList<>();
    for (Interest interest : interests) {
      Region region = interest.getProduct().getRegion();
      RegionReturnDto dto = RegionReturnDto.builder()
          .regionId(region.getRegionId())
          .regionSido(region.getRegionSido())
          .regionGugun(region.getRegionGugun())
          .regionDong(region.getRegionDong())
          .build();
      Product product = interest.getProduct();
      ProductReturnDto productReturnDto = ProductReturnDto.builder()
          .productId(product.getProductId())
          .productType(product.getProductType())
          .regionReturnDto(dto)
          .productAddress(product.getProductAddress())
          .productDeposit(product.getProductDeposit())
          .productRent(product.getProductRent())
          .productMaintenance(product.getProductMaintenance())
          .productMaintenanceInfo(product.getProductMaintenanceInfo())
          .productIsRentSupportable(product.isProductIsRentSupportable())
          .productIsFurnitureSupportable(product.isProductIsFurnitureSupportable())
          .productSquare(product.getProductSquare())
          .productRoom(product.getProductRoom())
          .productOption(product.getProductOption())
          .productAdditionalOption(getAdditionalOptionList(product))
          .productIsBanned(product.isProductIsBanned())
          .productIsDelete(product.isProductIsDeleted())
          .productStartDate(product.getProductStartDate())
          .productEndDate(product.getProductEndDate())
          .lat(product.getLat())
          .lng(product.getLng())
          .mediaList(product.getProductMedia())
          .productIsDelete(product.isProductIsDeleted())
          .build();
      InterestReturnDto interestReturnDto = InterestReturnDto.builder()
          .interestId(interest.getInterestId())
          .productReturnDto(productReturnDto)
          .build();
      interestReturnDtos.add(interestReturnDto);
    }

    return interestReturnDtos;
  }

  private static List<String> getAdditionalOptionList(Product p) {
    String s = p.getProductAdditionalOption();
    if (s == null || s.isEmpty()) {
      return null;
    }
    return Arrays.stream(s.split(",")).toList();
  }

  @Override
  public Interest getInterest(Long userId, Long productId) {
    return interestRepository.findByProduct_ProductIdAndUser_UserId(productId, userId).orElse(null);
  }

}
