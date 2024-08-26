package com.jisang.bangtong.controller.product;

import com.jisang.bangtong.constants.ResponseMessageConstants;
import com.jisang.bangtong.dto.Interest.InterestProductDto;
import com.jisang.bangtong.dto.common.ResponseDto;
import com.jisang.bangtong.dto.product.ProductReturnDto;
import com.jisang.bangtong.dto.product.ProductReturnDtoWIthProfile;
import com.jisang.bangtong.dto.product.ProductSearchDto;
import com.jisang.bangtong.dto.product.ProductUpdateDto;
import com.jisang.bangtong.dto.product.ProductUploadDto;
import com.jisang.bangtong.service.product.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/products")
public class ProductController {

  private final String SUCCESS = "success";
  private final String SERVER_ERROR = "server_error";
  private final String CLIENT_ERROR = "client_error";

  @Autowired
  private ProductService productService;

  //  매물 업로드
  @PostMapping(value = "/upload")
  public ResponseDto<Void> upload(@RequestPart @Valid ProductUploadDto productUploadDto,
      @RequestPart(required = false) List<MultipartFile> productMedia, HttpServletRequest request) {
    productService.upload(productUploadDto, productMedia, request);
    return new ResponseDto<>(SUCCESS);
  }

  @PutMapping("/modify/{productId}")
  public ResponseDto<Void> modify(@RequestBody @Valid ProductUpdateDto productUpdateDto,
      HttpServletRequest request, @PathVariable Long productId) {
    productService.update(productUpdateDto, productId, request);
    return new ResponseDto<>(SUCCESS);
  }

  //매물 조회
  @Transactional
  @GetMapping("/{productId}")
  public ResponseDto<ProductReturnDtoWIthProfile> getProduct(
      @PathVariable("productId") Long productId, HttpServletRequest request) {
    ProductReturnDtoWIthProfile product = productService.getProduct(productId, request);
    return new ResponseDto<>(SUCCESS, product);
  }

  @PutMapping("/delete/{productId}")
  public ResponseDto<Void> delete(@PathVariable("productId") Long productId,
      HttpServletRequest request) {
    productService.delete(productId, request);
    return new ResponseDto<>(SUCCESS);
  }

  @PostMapping("/search")
  public ResponseDto<List<ProductReturnDto>> search(@RequestBody ProductSearchDto productSearchDto,
      HttpServletRequest request) {
    List<ProductReturnDto> searchList = productService.searchList(productSearchDto, request);
    return new ResponseDto<>(SUCCESS, searchList);
  }

  @GetMapping("/recent/{userId}")
  public ResponseDto<ProductReturnDtoWIthProfile> getRecentInterestProduct(
      @PathVariable("userId") Long userId) {
    ProductReturnDtoWIthProfile productReturnDto = productService.getRecentInterestProduct(userId);
    return ResponseDto.res(ResponseMessageConstants.SUCCESS, productReturnDto);
  }

  @GetMapping("/count")
  public ResponseDto<Integer> getProductSize() {
    Integer productSize = productService.getProductSize();
    return ResponseDto.res("SUCCESS", productSize);
  }

  @GetMapping("/myproducts")
  public ResponseDto<List<ProductReturnDto>> getMakerProducts(HttpServletRequest request) {
    List<ProductReturnDto> productReturnDtoList = productService.getProductsByMaker(request);
    return ResponseDto.res(SUCCESS, productReturnDtoList);
  }

  @GetMapping("/recent/product")
  public ResponseDto<List<ProductReturnDto>> getRecentProduct(HttpServletRequest request) {
    List<ProductReturnDto> productReturnDto = productService.getRecentProducts(request);
    return ResponseDto.res("SUCCESS", productReturnDto);
  }

  @GetMapping("/interest/{productId}")
  public ResponseDto<InterestProductDto> getInterestProduct(@PathVariable Long productId) {
    return ResponseDto.res("SUCCESS", productService.getInterestProduct(productId));
  }

  @GetMapping("/preference/{preferenceId}")
  public ResponseDto<List<ProductReturnDto>> getPreferProduct(HttpServletRequest request,
      @PathVariable("preferenceId") Long preferenceId) {
    List<ProductReturnDto> productReturnDtoList = productService.getPreferProduct(request,
        preferenceId);
    return ResponseDto.res("SUCCESS", productReturnDtoList);
  }

}