package com.jisang.bangtong.repository.product;

import com.jisang.bangtong.model.product.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long>, ProductRepositoryCustom, ProductJDBCRepository {

  Product findById(long id);

  Product findFirstByRegion_RegionIdAndProductIsDeletedIsFalse(String regionId);

  Integer countProductByProductIsDeletedIsFalse();

  List<Product> findByUserUserId(Long userId);

  @Query(value = "SELECT * FROM product p WHERE p.region_id = :regionId ORDER BY p.product_post_date DESC LIMIT 3", nativeQuery = true)
  List<Product> findTop3ByRegionIdOrderByProductPostDateDesc(@Param("regionId") String regionId);
}