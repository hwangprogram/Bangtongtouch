package com.jisang.bangtong.repository.product.algorithm;

import com.jisang.bangtong.model.product.Productalgorithm;

public interface ProductAlgorithmCustomRepository {
  Productalgorithm getProductalgorithm(Double lat, Double lng);
}
