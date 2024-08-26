package com.jisang.bangtong.model.algorithm.seoul;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.io.Serializable;
import lombok.Data;



@Entity
@Data
public class Hospitalposencoded {

  @Id
  Long id;
  Double lat;
  Double lng;

  Long isHospital; //병원
  Long isPublicHealth; //
  Long isUnderPublicHealth;  //보건의원
  Long isSuperPublicHealth;  //대형종합
  Long isNursingHospital;  //요양
  Long isSmallHospital;  //의원
  Long isMentalHospital; //정신병원
  Long isMidwifeHospital; //조산원
  Long isGeneralHospital; //종합병원
  Long isDentalHospital; //치과
  Long isSmallDentalHospital;  //치과 의원
  Long isSmallOrientalHospital; //한방병원
  Long isOrientalHospital; // 한의원
}