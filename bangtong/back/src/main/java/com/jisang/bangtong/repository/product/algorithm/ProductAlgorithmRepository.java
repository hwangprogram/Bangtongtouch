package com.jisang.bangtong.repository.product.algorithm;

import com.jisang.bangtong.model.product.Productalgorithm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ProductAlgorithmRepository extends JpaRepository<Productalgorithm, Long>, ProductAlgorithmCustomRepository {
  Productalgorithm findByProduct_ProductId(Long productId);
}
