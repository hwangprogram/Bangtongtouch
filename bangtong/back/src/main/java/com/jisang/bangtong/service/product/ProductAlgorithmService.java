package com.jisang.bangtong.service.product;

import jakarta.transaction.Transactional;

@Transactional
public interface ProductAlgorithmService {

  void calculateDistances(String targetTableName, double radiusKm);


}
