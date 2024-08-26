package com.jisang.bangtong.model.region;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@Entity
@RequiredArgsConstructor
@AllArgsConstructor
public class Region {

  @Id
  @Column(length = 13)
  private String regionId;

  @Column(nullable = false, length = 7)
  private String regionSido;

  @Column(nullable = false, length = 10)
  private String regionGugun;

  @Column(nullable = false, length = 10)
  private String regionDong;
  // equals 메소드 오버라이드

}
