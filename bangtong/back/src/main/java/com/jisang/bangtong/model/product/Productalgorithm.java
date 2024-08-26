package com.jisang.bangtong.model.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Builder
@Data
@Entity
@RequiredArgsConstructor
@AllArgsConstructor
public class Productalgorithm {


  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "product_id", foreignKey = @ForeignKey(name="fk_productalgorithm_product"))
  private Product product;

  @Column(nullable = false)
  Double lat;
  @Column(nullable = false)
  Double lng;

  Double busstopSeoulClosestDistance;
  Long busstopSeoulCount;
  Double cctvSeoulClosestDistance;
  Long cctvSeoulCount;
  Double convSeoulClosestDistance;
  Long convSeoulCount;
  Double laundryCoinSeoulClosestDistance;
  Long laundryCoinSeoul;
  Double pharmDistance;
  Long pharmCount;
  Double policeDistance;
  Long policeCount;
  Double starbuckDist;
  Long starbuckCount;
  Double subwayDist;
  Long subwayCount;
  Double supermarketDist;
  Long supermarketCount;
  Double normalHospitalDist;  //병원
  Long normalHospitalCount; //일반병원 0.5km 개수
  Double publicHealthDist;  //보건소 개수
  Long publicHealthCount; //보건소 0.5km 개수
  Double publicUnderPublicHealth; //보건지소
  Long publicUnderPublicHealthCount;
  Double nursingHospitalDist; //요양병원
  Long nursingHospitalCount;
  Double smallHospitalDist; //의원
  Long smallHospitalCount;
  Double medHospitalDist; //조산사
  Long medHospitalCount; //조산사 숫자
  Double mentalHospitalDist;  //정신과
  Long mentalHospitalCount;
  Double generalHospitalDist; //종합 병원
  Long generalHospitalCount; //종합 병원 개수
  Double dentalHospitalDist; //치과 //ok
  Long dentalHospitalCount;
  Double smallDentalHospitalDist; //치과의원 ok
  Long smallDentalHospitalCount;
  Double smallOrientalHospitalDist;
  Long smallOrientalHospitalCount;
  Double orientalHospitalDist;
  Long orientalHospitalCount;
  Double superGeneralHospitalDist;//상급종합병원
  Long superGeneralHospitalCount;
}
