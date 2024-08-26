package com.jisang.bangtong.service.product;

import com.jisang.bangtong.dto.Interest.InterestProductDto;
import com.jisang.bangtong.dto.product.ProductReturnDto;
import com.jisang.bangtong.dto.product.ProductReturnDtoWIthProfile;
import com.jisang.bangtong.dto.product.ProductSearchDto;
import com.jisang.bangtong.dto.product.ProductUpdateDto;
import com.jisang.bangtong.dto.product.ProductUploadDto;
import com.jisang.bangtong.model.product.Product;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface ProductService {

  void upload(ProductUploadDto productUploadDto, List<MultipartFile> productMedia,
      HttpServletRequest request);

  void update(ProductUpdateDto product, Long productId, HttpServletRequest request);

  ProductReturnDtoWIthProfile getProduct(long productId, HttpServletRequest request);

  List<ProductReturnDto> searchList(ProductSearchDto productSearchDto, HttpServletRequest request);

  void delete(Long productId, HttpServletRequest request);

  ProductReturnDtoWIthProfile getRecentInterestProduct(Long userId);

  Integer getProductSize();

  List<ProductReturnDto> getRecentProducts(HttpServletRequest request);

  InterestProductDto getInterestProduct(Long productId);

  List<ProductReturnDto> getProductsByMaker(HttpServletRequest request);

  List<ProductReturnDto> getPreferProduct(HttpServletRequest request, Long preferProductId);
}