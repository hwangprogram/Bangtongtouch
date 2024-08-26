package com.jisang.bangtong.model.algorithm.seoul;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Laundrycoinseoul {

  @Id
  Long id;
  Double lat;   //위도
  Double lng;   //경도
}
