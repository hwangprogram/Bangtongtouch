package com.jisang.bangtong.repository.interest;

import com.jisang.bangtong.model.interest.Interest;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InterestRepository extends JpaRepository<Interest, Long> {
  @Modifying
  @Transactional
  @Query("DELETE FROM Interest i WHERE i.user.userId = :userId AND i.product.productId = :productId")
  void deleteByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);

  Optional<List<Interest>> findAllByUser_UserId(Long userId);

  Optional<Interest> findByProduct_ProductIdAndUser_UserId(Long productId, Long userId);
}
