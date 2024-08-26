package com.jisang.bangtong.service.product;

import com.amazonaws.services.kms.model.NotFoundException;
import com.jisang.bangtong.dto.Interest.InterestProductDto;
import com.jisang.bangtong.dto.product.ProductReturnDto;
import com.jisang.bangtong.dto.product.ProductReturnDtoWIthProfile;
import com.jisang.bangtong.dto.product.ProductSearchDto;
import com.jisang.bangtong.dto.product.ProductUpdateDto;
import com.jisang.bangtong.dto.product.ProductUploadDto;
import com.jisang.bangtong.dto.region.RegionReturnDto;
import com.jisang.bangtong.dto.user.ProfileDto;
import com.jisang.bangtong.model.algorithm.seoul.Hospitalposencoded;
import com.jisang.bangtong.model.interest.Interest;
import com.jisang.bangtong.model.media.Media;
import com.jisang.bangtong.model.preference.Preference;
import com.jisang.bangtong.model.product.Product;
import com.jisang.bangtong.model.product.Productalgorithm;
import com.jisang.bangtong.model.region.Region;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.interest.InterestRepository;
import com.jisang.bangtong.repository.preference.PreferenceRepository;
import com.jisang.bangtong.repository.product.algorithm.ProductAlgorithmRepository;
import com.jisang.bangtong.repository.product.ProductRepository;
import com.jisang.bangtong.repository.region.RegionRepository;
import com.jisang.bangtong.repository.user.UserRepository;
import com.jisang.bangtong.service.common.FileService;
import com.jisang.bangtong.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProductServiceImpl implements ProductService {

  @Autowired
  private ProductRepository productRepository;
  @Autowired
  private RegionRepository regionRepository;
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private JwtUtil jwtUtil;
  @Autowired
  private FileService fileService;
  @Autowired
  private InterestRepository interestRepository;
  @Autowired
  private PreferenceRepository preferenceRepository;
  @Autowired
  private ProductAlgorithmRepository productAlgorithmRepository;


  @Transactional
  @Override
  public void upload(ProductUploadDto productUploadDto, List<MultipartFile> productMedia,
      HttpServletRequest request) {

    String token = jwtUtil.getAccessToken(request);
    Long userId = jwtUtil.getUserIdFromToken(token);
    User u = userRepository.findById(userId).orElse(null);
    if (!isValidUser(u)) {
      throw new NotFoundException("매물을 업로드 하는 사용자와 정보가 다릅니다.");
    }
    Product product = getProductWhenUpload(productUploadDto, u);
    try {
      Product p = productRepository.save(product);
      //파일에서 프로덕트를 관리하기 위함
      List<Media> fileList = fileService.upload(fileService.getName(productMedia));
      for (Media media : fileList) {
        media.setProduct(p);
      }
      fileService.upload(fileList);
      p.setProductMedia(fileList);
      //파일에서 프로덕트 저장 끝
      productRepository.save(p);
      Productalgorithm productAlgorithm = productAlgorithmRepository.getProductalgorithm(p.getLat(),
          p.getLng());
      productAlgorithm.setProduct(product);
      productAlgorithmRepository.save(productAlgorithm);
    } catch (IOException e) {
      throw new IllegalArgumentException("파일을 저장할 수 없습니다");
    }

  }

  @Override
  @Transactional
  public void update(ProductUpdateDto productUpdateDto, Long productId,
      HttpServletRequest request) {
    String token = jwtUtil.getAccessToken(request);
    Long userId = jwtUtil.getUserIdFromToken(token);
    User u = userRepository.findById(userId).orElse(null);
    if (!isValidUser(u, userId)) {
      throw new NotFoundException("존재하지 않은 사용자거나 매물 등록을 하지 않은 유저입니다");
    }
    Product p = productRepository.findById(productUpdateDto.getProductId()).orElse(null);
    if (!isValidProduct(p, productId)) {
      throw new IllegalArgumentException("매물 정보가 일치하지 않습니다.");
    }
    Product product = getProductWhenUpdate(productUpdateDto);
    productRepository.save(product);
  }


  @Transactional
  public ProductReturnDtoWIthProfile getProduct(long productId, HttpServletRequest request) {
    Product product = productRepository.findById(productId);
    List<String> additionalOption = getAdditionalOptionList(product);
    RegionReturnDto regionReturnDto = getRegionReturnDto(product);
    String sido = regionReturnDto.getRegionSido().replace("특별", "");
    regionReturnDto.setRegionSido(sido);
    Set<Long> interestSet = new HashSet<>();
    if (request != null) {
      getInterestSet(interestSet, request);
    }

    User u = product.getUser();
    Media userPhoto = u.getUserProfileImage();
    ProfileDto profileDto = new ProfileDto();
    if (userPhoto != null) {
      profileDto.setProfileImage(userPhoto.getMediaPath());
    } else {
      profileDto.setProfileImage(null);
    }
    profileDto.setNickname(u.getUserNickname());
    profileDto.setUserId(u.getUserId());

    ProductReturnDto productReturnDto = ProductReturnDto.builder()
        .productId(product.getProductId())
        .productType(product.getProductType())
        .regionReturnDto(regionReturnDto)
        .productAddress(product.getProductAddress())
        .productDeposit(product.getProductDeposit())
        .productRent(product.getProductRent())
        .productPostDate(product.getProductPostDate())
        .productStartDate(product.getProductStartDate())
        .productEndDate(product.getProductEndDate())
        .lat(product.getLat())
        .lng(product.getLng())
        .productAdditionalDetail(product.getProductAdditionalOption())
        .mediaList(product.getProductMedia())
        .productMaintenance(product.getProductMaintenance())
        .productMaintenanceInfo(product.getProductMaintenanceInfo())
        .productIsRentSupportable(product.isProductIsRentSupportable())
        .productIsFurnitureSupportable(product.isProductIsFurnitureSupportable())
        .productSquare(product.getProductSquare()).productRoom(product.getProductRoom())
        .productAdditionalOption(additionalOption).productOption(product.getProductOption())
        .productIsInterest(interestSet.contains(product.getProductId()))
        .build();
    return ProductReturnDtoWIthProfile.builder()
        .productReturnDto(productReturnDto)
        .profileDto(profileDto)
        .build();
  }

  private static RegionReturnDto getRegionReturnDto(Product product) {
    Region region = product.getRegion();
    return RegionReturnDto.builder().regionId(region.getRegionId())
        .regionSido(region.getRegionSido()).regionGugun(region.getRegionGugun())
        .regionDong(region.getRegionDong()).build();
  }

  @Override
  public List<ProductReturnDto> searchList(ProductSearchDto productSearchDto,
      HttpServletRequest request) {
    List<Product> productList = productRepository.searchList(productSearchDto);
    List<ProductReturnDto> productReturnDtoList = new ArrayList<>();
    Set<Long> interestSet = new HashSet<>();
    getInterestSet(interestSet, request);

    for (Product p : productList) {
      Long pId = p.getProductId();
      double score = setScore(productSearchDto, pId);

      ProductReturnDto productReturnDto = ProductReturnDto.builder().productId(p.getProductId())
          .productType(p.getProductType()).regionReturnDto(getRegionReturnDto(p))
          .productAddress(p.getProductAddress()).productDeposit(p.getProductDeposit())
          .productRent(p.getProductRent()).productMaintenance(p.getProductMaintenance())
          .productMaintenanceInfo(p.getProductMaintenanceInfo())
          .productIsRentSupportable(p.isProductIsRentSupportable())
          .productIsFurnitureSupportable(p.isProductIsFurnitureSupportable())
          .productSquare(p.getProductSquare()).productRoom(p.getProductRoom())
          .productOption(p.getProductOption()).productAdditionalOption(getAdditionalOptionList(p))
          .productPostDate(p.getProductPostDate()).productStartDate(p.getProductStartDate())
          .productEndDate(p.getProductEndDate()).lat(p.getLat()).lng(p.getLng())
          .productAdditionalDetail(p.getProductAddressDetail())
          .productIsInterest(interestSet.contains(pId))
          .mediaList(p.getProductMedia())
          .productIsDelete(p.isProductIsDeleted())
          .score(score)
          .build();
      productReturnDtoList.add(productReturnDto);
    }

    //서울 지역에서만
    if (productSearchDto.getRegionId().substring(0, 2).equals("11")) {
      Collections.sort(productReturnDtoList,
          (o1, o2) -> -Double.compare(o1.getScore(), o2.getScore()));
    }

    return productReturnDtoList;
  }

  public List<ProductReturnDto> getProductsByMaker(HttpServletRequest request) {
    String token = jwtUtil.getAccessToken(request);
    if (token == null || token.isEmpty()) {
      return null;
    }
    Long userId = jwtUtil.getUserIdFromToken(token);
    User u = userRepository.findById(userId).orElse(null);
    if (!isValidUser(u)) {
      throw new IllegalArgumentException("올바르지 않은 접근입니다");
    }
    List<Product> products = productRepository.findByUserUserId(u.getUserId());
    if (products == null || products.isEmpty()) {
      return null;
    } else {
      List<ProductReturnDto> productReturnDtoList = new ArrayList<>();
      for (Product p : products) {
        ProductReturnDto returnDto = getProductReturnDto(p);
        productReturnDtoList.add(returnDto);
      }
      return productReturnDtoList;
    }
  }

  private static ProductReturnDto getProductReturnDto(Product p) {
    ProductReturnDto returnDto = ProductReturnDto.builder()
        .productId(p.getProductId())
        .productType(p.getProductType()).regionReturnDto(getRegionReturnDto(p))
        .productAddress(p.getProductAddress()).productDeposit(p.getProductDeposit())
        .productRent(p.getProductRent()).productMaintenance(p.getProductMaintenance())
        .productMaintenanceInfo(p.getProductMaintenanceInfo())
        .productIsRentSupportable(p.isProductIsRentSupportable())
        .productIsFurnitureSupportable(p.isProductIsFurnitureSupportable())
        .productSquare(p.getProductSquare()).productRoom(p.getProductRoom())
        .productOption(p.getProductOption()).productAdditionalOption(getAdditionalOptionList(p))
        .productPostDate(p.getProductPostDate()).productStartDate(p.getProductStartDate())
        .productEndDate(p.getProductEndDate()).lat(p.getLat()).lng(p.getLng())
        .productAdditionalDetail(p.getProductAddressDetail())
        .productIsInterest(false)
        .mediaList(p.getProductMedia())
        .productIsDelete(p.isProductIsDeleted())
        .score(0)
        .build();
    return returnDto;
  }


  private double setScore(ProductSearchDto dto, Long productId) {
    Productalgorithm productalgorithm = productAlgorithmRepository.findByProduct_ProductId(
        productId);
    if (productalgorithm == null) {
      return 0;
    }
    Integer option = dto.getInfra();
    double ret = 0.0;
    if ((option & 1) == 1) {
      Long policeCnt = productalgorithm.getPoliceCount();
      Double policeDist = productalgorithm.getPoliceDistance();
      Long cctvCnt = productalgorithm.getCctvSeoulCount();
      Double cctvDist = productalgorithm.getCctvSeoulClosestDistance();

      if (policeCnt != null && policeCnt <= 0) {
        ret += -2.7181604887904256;
      }
      if (policeDist != null && policeDist > 0.36 && policeDist <= 0.56) {
        ret += -4.24515004087326;
      }
      if (cctvCnt != null && cctvCnt > 75 && cctvCnt <= 109) {
        ret += -18.391124699666825;
      }
      if (cctvDist != null && cctvDist > 0.09) {
        ret += 50.445498125922114;
      }
    }
    if ((option & (1 << 1)) == (1 << 1)) {
      Long supermarkterCnt = productalgorithm.getSupermarketCount();
      Double supermarketDist = productalgorithm.getSupermarketDist();
      if (supermarkterCnt != null && supermarkterCnt > 13 && supermarkterCnt <= 19) {
        ret += -57.53468614600995;
      }
      if (supermarketDist != null && supermarketDist > 0.17) {
        ret += 30.293211203229827;
      }

    }
    if ((option & (1 << 2)) == (1 << 2)) {    //버스 정류장
      Double busDist = productalgorithm.getBusstopSeoulClosestDistance();
      Long busCnt = productalgorithm.getBusstopSeoulCount();
      if (busDist != null && busDist > 0.15) {
        ret += 21.084629277523636;
      }
      if (busCnt != null && busCnt <= 23 && busCnt > 17) {
        ret += -19.45562061252854;
      }
    }
    if ((option & (1 << 3)) == (1 << 3)) {     //병원
      //상급종합
      Long superHospital = productalgorithm.getSuperGeneralHospitalCount();
      Double superHospitalDist = productalgorithm.getSuperGeneralHospitalDist();
      if (superHospital != null && superHospitalDist > 4.12) {
        ret += -303.303553770808;
      }
      if (superHospital != null && superHospital < 1) {
        ret += 57.87145342704637;
      }
      //그냥 종합병원
      Long generalHospitalCnt = productalgorithm.getGeneralHospitalCount();
      Double generalHospitalDist = productalgorithm.getGeneralHospitalDist();
      if (generalHospitalDist != null && generalHospitalDist <= 1) {
        ret += -35.942001779647185;
      }
      if (generalHospitalCnt != null && generalHospitalCnt == 0) {
        ret += 2.971972571856797;
      }

      //보건 지소
      Long underPublicHealthCount = productalgorithm.getPublicUnderPublicHealthCount();
      Double underPublicHealthDist = productalgorithm.getPublicUnderPublicHealth();
      if (underPublicHealthCount != null && underPublicHealthDist <= 2.28) {
        ret -= -94.42704313250123;
      }
      if (underPublicHealthCount != null && underPublicHealthCount == 0) {
        ret += 27.84127382847077;
      }
      //보건소 병원
      Long publicHealthCnt = productalgorithm.getPublicHealthCount();
      Double publicHealthDist = productalgorithm.getPublicHealthDist();
      if (publicHealthCnt != null && publicHealthCnt <= 2) {
        ret += -3.4811696881925367;
      }
      if (publicHealthDist != null && publicHealthDist <= 1.78) {
        ret += -11.888826338813582;
      }

      //요양병원
      Long nursingCnt = productalgorithm.getNursingHospitalCount();
      Double nursingDist = productalgorithm.getNursingHospitalDist();
      if (nursingDist != null && nursingDist <= 0.56) {
        ret += -22.82111172832671;
      }
      if (nursingCnt != null && nursingCnt > 0) {
        ret += 5.031425493262448;
      }
      //조산사
      Long midHospitalCnt = productalgorithm.getMedHospitalCount();
      Double midHospitalDist = productalgorithm.getMedHospitalDist();
      if (midHospitalCnt != null && midHospitalCnt == 0) {
        ret += 39.389988220956695;
      }
      if (midHospitalDist != null && midHospitalDist <= 6.1 && midHospitalDist > 3.89) {
        ret += -40.657460849194734;
      }
      //정신과
      Long mentalCnt = productalgorithm.getMentalHospitalCount();
      Double mentalDist = productalgorithm.getMentalHospitalDist();
      if (mentalCnt != null && mentalCnt == 0) {
        ret += 21.507886253711597;
      }
      if (mentalDist != null && mentalDist <= 3.08) {
        ret += -194.42413615955323;
      }

      //치과
      Long dentalCnt = productalgorithm.getDentalHospitalCount();
      Double dentalDist = productalgorithm.getDentalHospitalDist();
      if (dentalCnt != null && dentalCnt > 0) {
        ret += 3.130521472309827;
      }
      if (dentalDist != null && dentalDist <= 0.84) {
        ret += 30.41897081223144;
      }

      //치과의원
      Long subDentalCnt = productalgorithm.getSmallDentalHospitalCount();
      Double subDentalDist = productalgorithm.getSmallDentalHospitalDist();
      if (subDentalCnt != null && subDentalCnt <= 9 && subDentalCnt > 5) {
        ret += 11.172964775457487;
      }
      if (subDentalDist != null && subDentalDist <= 0.09) {
        ret += 5.472533609656227;
      }

      //의원
      Long smallHospitalCnt = productalgorithm.getSmallHospitalCount();
      Double smallHospitalDist = productalgorithm.getSmallHospitalDist();
      if (smallHospitalCnt != null && smallHospitalCnt <= 25 && smallHospitalCnt > 15) {
        ret += -12.821935876922973;
      }
      if (smallHospitalDist != null && smallHospitalDist > 0.25) {
        ret += -8.712359511950673;
      }
      //병원
      Long normalHospitalCnt = productalgorithm.getNormalHospitalCount();
      Double normalHospitalDist = productalgorithm.getNormalHospitalDist();
      if (normalHospitalCnt != null && normalHospitalCnt == 0) {
        ret += 27.32781303562067;
      }
      if (normalHospitalDist != null && normalHospitalDist >= 0.73) {
        ret += -4.763224632029177;
      }

      //한방
      Long orientalHospitalCnt = productalgorithm.getOrientalHospitalCount();
      Double orientalHospitalDist = productalgorithm.getOrientalHospitalDist();

      if (orientalHospitalDist != null && orientalHospitalDist > 1.07
          && orientalHospitalDist <= 1.62) {
        ret += 18.454698516598906;
      }
      if (orientalHospitalCnt != null && orientalHospitalCnt == 0) {
        ret += -17.356886016784596;
      }

      Long smallOrientalHospitalCnt = productalgorithm.getSmallOrientalHospitalCount();
      Double smallOrientalHospitalDist = productalgorithm.getSmallOrientalHospitalDist();
      if (smallOrientalHospitalCnt != null && smallOrientalHospitalCnt <= 10
          && smallOrientalHospitalCnt > 6) {
        ret += 0.8127931044432241;
      }
      if (smallOrientalHospitalDist != null && smallOrientalHospitalDist <= 0.19
          && smallOrientalHospitalDist < 0.11) {
        ret += -4.822236248626365;
      }


    }
    if ((option & (1 << 4)) == (1 << 4)) {     //지하철
      Long subwayCnt = productalgorithm.getSubwayCount();
      Double subwayDist = productalgorithm.getSubwayDist();
      if (subwayCnt != null && subwayCnt <= 1) {
        ret += 0.2938612172484225;
      }
      if (subwayDist != null && subwayDist <= 0.67 && subwayDist > 0.46) {
        ret += -7.425196813670591;
      }
    }
    if ((option & (1 << 5)) == (1 << 5)) {    //카페
      Double cafeDist = productalgorithm.getStarbuckDist();
      Long cafeCnt = productalgorithm.getStarbuckCount();
      if (cafeDist != null && cafeDist <= 0.44 && cafeDist > 0.26) {
        ret += 59.56872869478652;
      }
      if (cafeCnt != null && cafeCnt <= 1) {
        ret += -8.213124441542957;
      }
    }
    if ((option & (1 << 6)) == (1 << 6)) {    //코인 세탁소
      Long laundryCnt = productalgorithm.getLaundryCoinSeoul();
      Double laundryDist = productalgorithm.getLaundryCoinSeoulClosestDistance();
      if (laundryCnt != null && laundryCnt < 1) {
        ret += 15.783593000041073;
      }
      if (laundryDist != null && laundryDist > 1.26) {
        ret += 10.91839462249061;
      }
    }
    if ((option & (1 << 7)) == (1 << 7)) {     //편의점
      Long convCnt = productalgorithm.getConvSeoulCount();
      Double convDist = productalgorithm.getConvSeoulClosestDistance();
      if (convCnt != null && convCnt <= 24 && convCnt > 16) {
        ret += -40.75057150510165;
      }
      if (convDist != null && convDist <= 0.03) {
        ret += -11.791301911458477;
      }
    }
    return ret;
  }

  private static List<String> getAdditionalOptionList(Product p) {
    String s = p.getProductAdditionalOption();
    if (s == null || s.isEmpty()) {
      return null;
    }
    return Arrays.stream(s.split(",")).toList();
  }

  @Override
  @Transactional
  public void delete(Long productId, HttpServletRequest request) {

    // 유효 매물 검증 로직
    Product product = productRepository.findById(productId).orElse(null);
    if (product == null) {
      throw new NotFoundException("삭제하려는 게시물이 없습니다");
    }

    //사용자 로직
    String token = jwtUtil.getAccessToken(request);
    Long userId = jwtUtil.getUserIdFromToken(token);
    User u = userRepository.findById(userId).orElse(null);
    if (!isValidUser(u, product.getUser().getUserId())) {
      throw new IllegalArgumentException("올바르지 않은 사용자입니다");
    }

    product.setProductIsDeleted(true);
    productRepository.save(product);
  }

  @Override
  public ProductReturnDtoWIthProfile getRecentInterestProduct(Long userId) {
    Preference preference = preferenceRepository.findFirstByUser_UserId(userId);

    if (preference == null) {
      return null;
    }

    String regionId = preference.getRegion().getRegionId();
    Product product = productRepository.findFirstByRegion_RegionIdAndProductIsDeletedIsFalse(
        regionId);

    return getProduct(product.getProductId(), null);
  }


  //빈 인터레스트 셋을 입력받아서 사용자에 따라 어떤 매물을 관심있어 하는지 반환하는 메서드, isLike는 살펴볼만하다는 것을 의미하고,
  //셋에는 실제 productId가 반환되어 있음.
  private void getInterestSet(Set<Long> interestSet, HttpServletRequest request) {
    String token = jwtUtil.getAccessToken(request);
    if (token == null || token.isEmpty()) {
      return;
    }
    try {
      Long userId = jwtUtil.getUserIdFromToken(token);
      User u = userRepository.findById(userId).orElse(null);
      if (isValidUser(u)) {
        List<Interest> interestList = interestRepository.findAllByUser_UserId(userId).orElse(null);
        if (interestList != null) {
          for (Interest interest : interestList) {
            interestSet.add(interest.getProduct().getProductId());
          }
        }
      } else {
        throw new IllegalArgumentException("로그인 정보가 일치하지 않습니다");
      }
    } catch (Exception e) {
      throw new IllegalArgumentException("토큰 정보가 일치하지 않습니다");
    }
  }

  public List<ProductReturnDto> getPreferProduct(HttpServletRequest request, Long preferProductId) {
    String token = jwtUtil.getAccessToken(request);
    Long userId = jwtUtil.getUserIdFromToken(token);

    Preference preference = preferenceRepository.findById(preferProductId).orElse(null);
    if (preference == null) {
      throw new IllegalArgumentException("유효한 선호설정이 아닙니다");
    }
    if (!(userId.equals(preference.getUser().getUserId()))) {
      throw new NotFoundException("유효한 사용자가 아닙니다");
    }
    Region region = preference.getRegion();
    List<Product> products = productRepository.findTop3ByRegionIdOrderByProductPostDateDesc(
        region.getRegionId());
    List<ProductReturnDto> productReturnDtos = new ArrayList<>();
    for (Product p : products) {
      ProductReturnDto productReturnDto = getProductReturnDto(p);
      productReturnDtos.add(productReturnDto);
    }
    return productReturnDtos;
  }

  private Product getProductWhenUpdate(ProductUpdateDto productUpdateDto) {
    Product product = productRepository.findById(productUpdateDto.getProductId()).orElse(null);
    //setter 설정
    product.setProductId(productUpdateDto.getProductId());
    product.setProductDeposit(productUpdateDto.getProductDeposit());
    product.setProductMaintenance(productUpdateDto.getProductMaintenance());
    product.setProductIsRentSupportable(productUpdateDto.getProductIsRentSupportable());
    product.setProductIsFurnitureSupportable(productUpdateDto.getProductIsFurnitureSupportable());
    product.setProductOption(productUpdateDto.getProductOption());
    product.setProductAdditionalOption(productUpdateDto.getProductAdditionalOption());
    product.setProductStartDate(productUpdateDto.getProductStartDate());
    product.setProductEndDate(productUpdateDto.getProductEndDate());
    return product;
  }

  private Product getProductWhenUpload(ProductUploadDto productUploadDto, User u) {

    List<String> strList = productUploadDto.getProductAdditionalOption();
    StringBuilder sb = new StringBuilder();

    if (strList != null && !strList.isEmpty()) {
      for (int i = 0; i < strList.size() - 1; i++) {
        String option = strList.get(i);
        sb.append(option).append(",");
      }
      sb.append(strList.get(strList.size() - 1));
    } else {
      sb.append("없음");
    }

    return Product.builder().productType(productUploadDto.getProductType())
        .region(regionRepository.findById(productUploadDto.getRegionId()).get()).user(u)
        .productAddress(productUploadDto.getProductAddress())
        .productDeposit(productUploadDto.getProductDeposit())
        .productRent(productUploadDto.getProductRent())
        .productMaintenance(productUploadDto.getProductMaintenance())
        .productMaintenanceInfo(productUploadDto.getProductMaintenanceInfo())
        .productSquare(productUploadDto.getProductSquare())
        .productRoom(productUploadDto.getProductRoom())
        .productOption(productUploadDto.getProductOption()).productAdditionalOption(sb.toString())
        .productAddress(productUploadDto.getProductAddress())
        .productStartDate(productUploadDto.getProductStartDate())
        .productEndDate(productUploadDto.getProductEndDate())
        .productAddressDetail(productUploadDto.getProductDetailAddress())
        .productDescription(productUploadDto.getProductDescription())
        .lat(productUploadDto.getLat()).lng(productUploadDto.getLng()).build();
  }


  @Override
  public List<ProductReturnDto> getRecentProducts(HttpServletRequest request) {
    String token = jwtUtil.getAccessToken(request);
    if (token.isEmpty()) {
      throw new IllegalArgumentException("토큰이 만료되었습니다.");
    }
    Long userId = jwtUtil.getUserIdFromToken(token);
    User u = userRepository.findById(userId).orElse(null);
    if (!isValidUser(u)) {
      throw new NotFoundException("사용자를 찾을 수 없습니다");
    }
    Preference preference = preferenceRepository.findFirstByUser_UserId(userId);
    String regionId = preference.getRegion().getRegionId();

    List<Product> plist = productRepository.getRecentProducts(regionId);
    List<ProductReturnDto> productReturnDtoList = new ArrayList<>();
    for (Product p : plist) {
      ProductReturnDto productReturnDto = ProductReturnDto.builder()
          .productId(p.getProductId())
          .productType(p.getProductType()).regionReturnDto(getRegionReturnDto(p))
          .productAddress(p.getProductAddress()).productDeposit(p.getProductDeposit())
          .productRent(p.getProductRent()).productMaintenance(p.getProductMaintenance())
          .productMaintenanceInfo(p.getProductMaintenanceInfo())
          .productIsRentSupportable(p.isProductIsRentSupportable())
          .productIsFurnitureSupportable(p.isProductIsFurnitureSupportable())
          .productSquare(p.getProductSquare()).productRoom(p.getProductRoom())
          .productOption(p.getProductOption()).productAdditionalOption(getAdditionalOptionList(p))
          .productPostDate(p.getProductPostDate()).productStartDate(p.getProductStartDate())
          .productEndDate(p.getProductEndDate()).lat(p.getLat()).lng(p.getLng())
          .productAdditionalDetail(p.getProductAddressDetail())
          .productIsInterest(false)
          .mediaList(p.getProductMedia())
          .productIsDelete(p.isProductIsDeleted())
          .build();
      productReturnDtoList.add(productReturnDto);
    }

    return productReturnDtoList;
  }

  @Override
  public InterestProductDto getInterestProduct(Long productId) {

    if (productRepository.findById(productId).orElse(null) == null) {
      throw new NotFoundException("해당 매물이 없습니다");
    }

    return productRepository.getInterestProduct(productId);
  }


  @Override
  public Integer getProductSize() {
    return productRepository.countProductByProductIsDeletedIsFalse();
  }

  private boolean isValidUser(User u, Long productId) {
    if (u == null) {
      return false;
    }
    if (u.getUserId().equals(productId)) {
      return true;
    } else {
      return false;
    }
  }

  private boolean isValidUser(User u) {
    if (u == null) {
      return false;
    }
    return true;
  }

  private boolean isValidProduct(Product p, Long productId) {
    if (p == null) {
      return false;
    }
    return p.getProductId() == productId;
  }
}
