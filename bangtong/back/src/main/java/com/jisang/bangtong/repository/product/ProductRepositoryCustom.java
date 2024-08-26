package com.jisang.bangtong.repository.product;

import com.jisang.bangtong.dto.Interest.InterestProductDto;
import com.jisang.bangtong.dto.product.ProductReturnDto;
import com.jisang.bangtong.dto.product.ProductSearchDto;
import com.jisang.bangtong.model.product.Product;
import java.util.List;
import org.springframework.stereotype.Repository;

public interface ProductRepositoryCustom {

  InterestProductDto getInterestProduct(Long productId);
  List<Product> getRecentProducts(String regionId);
  
}
