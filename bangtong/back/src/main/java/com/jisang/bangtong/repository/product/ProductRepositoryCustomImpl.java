package com.jisang.bangtong.repository.product;


import static com.jisang.bangtong.model.product.QProduct.product;
import static com.querydsl.core.types.dsl.Expressions.numberTemplate;

import com.jisang.bangtong.dto.Interest.InterestProductDto;
import com.jisang.bangtong.dto.product.ProductReturnDto;
import com.jisang.bangtong.dto.product.ProductSearchDto;
import com.jisang.bangtong.dto.region.RegionReturnDto;
import com.jisang.bangtong.model.chatroom.QChatroom;
import com.jisang.bangtong.model.interest.QInterest;
import com.jisang.bangtong.model.media.Media;
import com.jisang.bangtong.model.product.Product;
import com.jisang.bangtong.model.product.ProductType;
import com.jisang.bangtong.model.product.QProduct;
import com.jisang.bangtong.model.region.QRegion;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

@Slf4j
public class ProductRepositoryCustomImpl implements ProductRepositoryCustom{
  private final JPAQueryFactory queryFactory;
  private final EntityManager entityManager;
  private final QProduct product = QProduct.product;
  @Autowired
  public ProductRepositoryCustomImpl(JPAQueryFactory queryFactory, EntityManager entityManager) {
    this.queryFactory = queryFactory;
    this.entityManager = entityManager;
  }


  private OrderSpecifier<?>[] buildOrderSpecifiers(int order) {
    switch (order) {
      case 0:
        return new OrderSpecifier<?>[]{product.productScore.desc()};
      case 1:
        return new OrderSpecifier<?>[]{product.productPostDate.asc()};
      case 2:
        return new OrderSpecifier<?>[]{product.productDeposit.asc().nullsFirst(), product.productMaintenance.asc().nullsFirst()};
      case 3:
        return new OrderSpecifier<?>[]{product.productSquare.desc()};
      default:
        throw new IllegalArgumentException("Unknown order: " + order); // 예외를 던져서 문제 회피
    }
  }

  @Override
  public InterestProductDto getInterestProduct(Long productId) {

    Long chatroomCnt = countChatroomByProductId(productId);
    Long interestCnt = countInterestsByProductId(productId);

    return new InterestProductDto(interestCnt, chatroomCnt);
  }

  // Method to count interests for a given productId
  public Long countInterestsByProductId(Long productId) {
    QInterest qInterest = QInterest.interest;

    return queryFactory
        .select(qInterest.count())
        .from(qInterest)
        .where(qInterest.product.productId.eq(productId))
        .fetchOne();
  }

  public Long countChatroomByProductId(Long productId) {
    QChatroom qChatroom = QChatroom.chatroom;

    return queryFactory
        .select(qChatroom.count())
        .from(qChatroom)
        .where(qChatroom.product.productId.eq(productId))
        .fetchOne();
  }

  public List<Product> getRecentProducts(String regionId){

    return queryFactory.selectFrom(product)
        .where(
            product.region.regionId.eq(regionId)
        )
        .orderBy(product.productPostDate.desc())
        .limit(3)
        .fetch();
  }
}