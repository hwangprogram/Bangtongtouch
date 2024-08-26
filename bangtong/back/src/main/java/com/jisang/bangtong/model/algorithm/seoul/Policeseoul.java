package com.jisang.bangtong.model.algorithm.seoul;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Policeseoul {
  @Id
  private Long id;
  private Double lat;   //위도
  private Double lng;   //경도
}
