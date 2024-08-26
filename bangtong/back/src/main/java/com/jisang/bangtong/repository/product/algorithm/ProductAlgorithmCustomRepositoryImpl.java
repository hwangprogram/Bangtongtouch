package com.jisang.bangtong.repository.product.algorithm;

import com.jisang.bangtong.model.algorithm.seoul.Hospitalposencoded;
import com.jisang.bangtong.model.algorithm.seoul.QBusstopseoul;
import com.jisang.bangtong.model.algorithm.seoul.QCctvseoul;
import com.jisang.bangtong.model.algorithm.seoul.QConvseoul;
import com.jisang.bangtong.model.algorithm.seoul.QHospitalposencoded;
import com.jisang.bangtong.model.algorithm.seoul.QLaundrycoinseoul;
import com.jisang.bangtong.model.algorithm.seoul.QPharmseoul;
import com.jisang.bangtong.model.algorithm.seoul.QPoliceseoul;
import com.jisang.bangtong.model.algorithm.seoul.QStarbuckseoul;
import com.jisang.bangtong.model.algorithm.seoul.QSubwayseoul;
import com.jisang.bangtong.model.algorithm.seoul.QSupermarketseoul;
import com.jisang.bangtong.model.product.Productalgorithm;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.EntityPathBase;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.core.types.dsl.NumberPath;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@Slf4j
public class ProductAlgorithmCustomRepositoryImpl implements ProductAlgorithmCustomRepository {

  private final EntityManager em;
  private final JPAQueryFactory queryfactory;

  public ProductAlgorithmCustomRepositoryImpl(EntityManager em, JPAQueryFactory queryfactory) {
    this.em = em;
    this.queryfactory = queryfactory;
  }


  public Productalgorithm getProductalgorithm(Double lat, Double lng) {
    Productalgorithm productAlgorithm = new Productalgorithm();
    productAlgorithm.setLat(lat);
    productAlgorithm.setLng(lng);

    processEntity("Busstop", QBusstopseoul.busstopseoul, QBusstopseoul.busstopseoul.lat,
        QBusstopseoul.busstopseoul.lng, lat, lng, productAlgorithm);
    processEntity("Cctv", QCctvseoul.cctvseoul, QCctvseoul.cctvseoul.lat, QCctvseoul.cctvseoul.lng,
        lat, lng, productAlgorithm);
    processEntity("Conv", QConvseoul.convseoul, QConvseoul.convseoul.lat, QConvseoul.convseoul.lng,
        lat, lng, productAlgorithm);
    processEntity("Laundrycoin", QLaundrycoinseoul.laundrycoinseoul,
        QLaundrycoinseoul.laundrycoinseoul.lat, QLaundrycoinseoul.laundrycoinseoul.lng, lat, lng,
        productAlgorithm);
    processEntity("Pharm", QPharmseoul.pharmseoul, QPharmseoul.pharmseoul.lat,
        QPharmseoul.pharmseoul.lng, lat, lng, productAlgorithm);
    processEntity("Police", QPoliceseoul.policeseoul, QPoliceseoul.policeseoul.lat,
        QPoliceseoul.policeseoul.lng, lat, lng, productAlgorithm);
    processEntity("Starbucks", QStarbuckseoul.starbuckseoul, QStarbuckseoul.starbuckseoul.lat,
        QStarbuckseoul.starbuckseoul.lng, lat, lng, productAlgorithm);
    processEntity("Subway", QSubwayseoul.subwayseoul, QSubwayseoul.subwayseoul.lat,
        QSubwayseoul.subwayseoul.lng, lat, lng, productAlgorithm);
    processEntity("Supermarket", QSupermarketseoul.supermarketseoul,
        QSupermarketseoul.supermarketseoul.lat, QSupermarketseoul.supermarketseoul.lng, lat, lng,
        productAlgorithm);

    findSmallOriental(QHospitalposencoded.hospitalposencoded,
        QHospitalposencoded.hospitalposencoded.lat, QHospitalposencoded.hospitalposencoded.lng, lat,
        lng, productAlgorithm);
    findOriental(QHospitalposencoded.hospitalposencoded, QHospitalposencoded.hospitalposencoded.lat,
        QHospitalposencoded.hospitalposencoded.lng, lat, lng, productAlgorithm);
    findGeneral(QHospitalposencoded.hospitalposencoded, QHospitalposencoded.hospitalposencoded.lat,
        QHospitalposencoded.hospitalposencoded.lng, lat, lng, productAlgorithm);
    findMidWife(QHospitalposencoded.hospitalposencoded, QHospitalposencoded.hospitalposencoded.lat,
        QHospitalposencoded.hospitalposencoded.lng, lat, lng, productAlgorithm);
    findMentalHospital(QHospitalposencoded.hospitalposencoded,
        QHospitalposencoded.hospitalposencoded.lat, QHospitalposencoded.hospitalposencoded.lng, lat,
        lng, productAlgorithm);
    findSmallHospital(QHospitalposencoded.hospitalposencoded,
        QHospitalposencoded.hospitalposencoded.lat, QHospitalposencoded.hospitalposencoded.lng, lat,
        lng, productAlgorithm);
    findNursingHospital(QHospitalposencoded.hospitalposencoded,
        QHospitalposencoded.hospitalposencoded.lat, QHospitalposencoded.hospitalposencoded.lng, lat,
        lng, productAlgorithm);
    findUnderHospital(QHospitalposencoded.hospitalposencoded,
        QHospitalposencoded.hospitalposencoded.lat, QHospitalposencoded.hospitalposencoded.lng, lat,
        lng, productAlgorithm);
    findPublicHospital(QHospitalposencoded.hospitalposencoded,
        QHospitalposencoded.hospitalposencoded.lat, QHospitalposencoded.hospitalposencoded.lng, lat,
        lng, productAlgorithm);
    findNormalHospital(QHospitalposencoded.hospitalposencoded,
        QHospitalposencoded.hospitalposencoded.lat, QHospitalposencoded.hospitalposencoded.lng, lat,
        lng, productAlgorithm);
    findDental(QHospitalposencoded.hospitalposencoded, QHospitalposencoded.hospitalposencoded.lat,
        QHospitalposencoded.hospitalposencoded.lng, lat, lng, productAlgorithm);
    findSuperPublicHospital(QHospitalposencoded.hospitalposencoded,
        QHospitalposencoded.hospitalposencoded.lat, QHospitalposencoded.hospitalposencoded.lng, lat,
        lng, productAlgorithm);
    findSmallDental(QHospitalposencoded.hospitalposencoded,
        QHospitalposencoded.hospitalposencoded.lat, QHospitalposencoded.hospitalposencoded.lng, lat,
        lng, productAlgorithm);

    em.persist(productAlgorithm);
    return productAlgorithm;
  }

  // Refactored method to find the shortest distance
  public <T extends EntityPathBase<?>> double findShortestDistance(T entity,
      NumberPath<Double> latPath, NumberPath<Double> lonPath, double refLat, double refLon,
      EntityManager em) {
    return new JPAQuery<>(em)
        .select(calculateDistance(latPath, lonPath, refLat, refLon).min())
        .from(entity)
        .fetchOne();
  }


  private <T extends EntityPathBase<?>> void processEntity(
      String entityName,
      T entity,
      NumberPath<Double> latPath,
      NumberPath<Double> lonPath,
      double refLat,
      double refLon,
      Productalgorithm productAlgorithm) {

    // Calculate count and distance for the current entity
    long count = countEntitiesWithinRadius(entity, latPath, lonPath, refLat, refLon, 0.5, em);
    double distance = findShortestDistance(entity, latPath, lonPath, refLat, refLon, em);

    // Set the calculated values in the Productalgorithm object
    switch (entityName) {
      case "Busstop":
        productAlgorithm.setBusstopSeoulCount(count);
        productAlgorithm.setBusstopSeoulClosestDistance(distance);
        break;
      case "Cctv":
        productAlgorithm.setCctvSeoulCount(count);
        productAlgorithm.setCctvSeoulClosestDistance(distance);
        break;
      case "Conv":
        productAlgorithm.setConvSeoulCount(count);
        productAlgorithm.setConvSeoulClosestDistance(distance);
        break;
      case "Laundrycoin":
        productAlgorithm.setLaundryCoinSeoul(count);
        productAlgorithm.setLaundryCoinSeoulClosestDistance(distance);
        break;
      case "Pharm":
        productAlgorithm.setPharmCount(count);
        productAlgorithm.setPharmDistance(distance);
        break;
      case "Police":
        productAlgorithm.setPoliceCount(count);
        productAlgorithm.setPoliceDistance(distance);
        break;
      case "Starbucks":
        productAlgorithm.setStarbuckCount(count);
        productAlgorithm.setStarbuckDist(distance);
        break;
      case "Subway":
        productAlgorithm.setSubwayCount(count);
        productAlgorithm.setSubwayDist(distance);
        break;
      case "Supermarket":
        productAlgorithm.setSupermarketCount(count);
        productAlgorithm.setSupermarketDist(distance);
        break;
      default:
        log.warn("Unknown entity type: {}", entityName);
        break;
    }
  }

  // Refactored method to count entities within radius
  public <T extends EntityPathBase<?>> long countEntitiesWithinRadius(T entity,
      NumberPath<Double> latPath, NumberPath<Double> lonPath, double refLat, double refLon,
      double radiusKm, EntityManager em) {
    return new JPAQuery<>(em)
        .select(entity.count())
        .from(entity)
        .where(withinRadius(latPath, lonPath, refLat, refLon, radiusKm))
        .fetchOne();
  }

  // Calculate distance using the Haversine formula
  private NumberExpression<Double> calculateDistance(NumberPath<Double> targetLat,
      NumberPath<Double> targetLon, double refLat, double refLon) {

    NumberTemplate<Double> distance = Expressions.numberTemplate(Double.class,
        "6371 * acos(cos(radians({0})) * cos(radians({1})) * cos(radians({2}) - radians({3})) + sin(radians({0})) * sin(radians({1})))",
        targetLat, refLat, refLon, targetLon
    );

    return distance;
  }

  // Determine if the entity's location is within the specified radius
  private BooleanExpression withinRadius(NumberPath<Double> targetLat, NumberPath<Double> targetLon,
      double refLat, double refLon, double radiusKm) {

    NumberTemplate<Double> distance = Expressions.numberTemplate(Double.class,
        "6371 * acos(cos(radians({0})) * cos(radians({1})) * cos(radians({2}) - radians({3})) + sin(radians({0})) * sin(radians({1})))",
        targetLat, refLat, refLon, targetLon
    );

    return distance.loe(radiusKm);
  }

  public void findDental(QHospitalposencoded hospitalposencoded, NumberPath<Double> latPath,
      NumberPath<Double> lonPath, double refLat, double refLon, Productalgorithm productAlgorithm) {

    Double shortestDentalDistance = queryfactory
        .select(calculateDistance(latPath, lonPath, refLat, refLon).min())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isDentalHospital.eq(1L))
        .fetchOne();

    // 반경 내 개수 계산 (dentalHospital이 1인 경우만)
    Long dentalCount = queryfactory
        .select(hospitalposencoded.count())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isDentalHospital.eq(1L)
            .and(calculateDistance(latPath, lonPath, refLat, refLon).loe(0.5)))
        .fetchOne();

    productAlgorithm.setDentalHospitalCount(dentalCount);
    productAlgorithm.setDentalHospitalDist(shortestDentalDistance);
  }


  public void findNormalHospital(QHospitalposencoded hospitalposencoded, NumberPath<Double> latPath,
      NumberPath<Double> lonPath, double refLat, double refLon, Productalgorithm productAlgorithm) {
    Double shortestNormalHospitalDistance = queryfactory
        .select(calculateDistance(latPath, lonPath, refLat, refLon).min())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isHospital.eq(1L))
        .fetchOne();

    Long normalHospitalCount = queryfactory
        .select(hospitalposencoded.count())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isHospital.eq(1L)
            .and(calculateDistance(latPath, lonPath, refLat, refLon).loe(0.5)))
        .fetchOne();

    productAlgorithm.setNormalHospitalCount(normalHospitalCount);
    productAlgorithm.setNormalHospitalDist(shortestNormalHospitalDistance);
  }

  public void findPublicHospital(QHospitalposencoded hospitalposencoded, NumberPath<Double> latPath,
      NumberPath<Double> lonPath, double refLat, double refLon, Productalgorithm productAlgorithm) {
    Double shortestNormalHospitalDistance = queryfactory
        .select(calculateDistance(latPath, lonPath, refLat, refLon).min())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isPublicHealth.eq(1L))
        .fetchOne();

    Long normalHospitalCount = queryfactory
        .select(hospitalposencoded.count())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isPublicHealth.eq(1L)
            .and(calculateDistance(latPath, lonPath, refLat, refLon).loe(0.5)))
        .fetchOne();

    productAlgorithm.setPublicHealthCount(normalHospitalCount);
    productAlgorithm.setPublicHealthDist(shortestNormalHospitalDistance);
  }

  public void findUnderHospital(QHospitalposencoded hospitalposencoded, NumberPath<Double> latPath,
      NumberPath<Double> lonPath, double refLat, double refLon, Productalgorithm productAlgorithm) {
    Double underDist = queryfactory
        .select(calculateDistance(latPath, lonPath, refLat, refLon).min())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isUnderPublicHealth.eq(1L))
        .fetchOne();

    Long underCnt = queryfactory
        .select(hospitalposencoded.count())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isUnderPublicHealth.eq(1L)
            .and(calculateDistance(latPath, lonPath, refLat, refLon).loe(0.5)))
        .fetchOne();

    productAlgorithm.setPublicUnderPublicHealth(underDist);
    productAlgorithm.setPublicUnderPublicHealthCount(underCnt);
  }

  public void findSuperPublicHospital(QHospitalposencoded hospitalposencoded,
      NumberPath<Double> latPath, NumberPath<Double> lonPath, double refLat, double refLon,
      Productalgorithm productAlgorithm) {
    Double superDist = queryfactory
        .select(calculateDistance(latPath, lonPath, refLat, refLon).min())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isSuperPublicHealth.eq(1L))
        .fetchOne();

    Long superCnt = queryfactory
        .select(hospitalposencoded.count())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isSuperPublicHealth.eq(1L)
            .and(calculateDistance(latPath, lonPath, refLat, refLon).loe(0.5)))
        .fetchOne();

    productAlgorithm.setSuperGeneralHospitalDist(superDist);
    productAlgorithm.setSuperGeneralHospitalCount(superCnt);
  }

  public void findNursingHospital(QHospitalposencoded hospitalposencoded,
      NumberPath<Double> latPath, NumberPath<Double> lonPath, double refLat, double refLon,
      Productalgorithm productAlgorithm) {
    Double nursingDist = queryfactory
        .select(calculateDistance(latPath, lonPath, refLat, refLon).min())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isNursingHospital.eq(1L))
        .fetchOne();

    Long nursingCnt = queryfactory
        .select(hospitalposencoded.count())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isNursingHospital.eq(1L)
            .and(calculateDistance(latPath, lonPath, refLat, refLon).loe(0.5)))
        .fetchOne();

    productAlgorithm.setNursingHospitalDist(nursingDist);
    productAlgorithm.setNursingHospitalCount(nursingCnt);
  }

  public void findSmallHospital(QHospitalposencoded hospitalposencoded, NumberPath<Double> latPath,
      NumberPath<Double> lonPath, double refLat, double refLon, Productalgorithm productAlgorithm) {
    Double smallHospitalDist = queryfactory
        .select(calculateDistance(latPath, lonPath, refLat, refLon).min())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isSmallHospital.eq(1L))
        .fetchOne();

    Long smallHostCnt = queryfactory
        .select(hospitalposencoded.count())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isSmallHospital.eq(1L)
            .and(calculateDistance(latPath, lonPath, refLat, refLon).loe(0.5)))
        .fetchOne();

    productAlgorithm.setSmallHospitalDist(smallHospitalDist);
    productAlgorithm.setSmallHospitalCount(smallHostCnt);
  }


  public void findMentalHospital(QHospitalposencoded hospitalposencoded, NumberPath<Double> latPath,
      NumberPath<Double> lonPath, double refLat, double refLon, Productalgorithm productAlgorithm) {
    Double mentalDist = queryfactory
        .select(calculateDistance(latPath, lonPath, refLat, refLon).min())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isMentalHospital.eq(1L))
        .fetchOne();

    Long mentalCnt = queryfactory
        .select(hospitalposencoded.count())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isMentalHospital.eq(1L)
            .and(calculateDistance(latPath, lonPath, refLat, refLon).loe(0.5)))
        .fetchOne();

    productAlgorithm.setMentalHospitalDist(mentalDist);
    productAlgorithm.setMentalHospitalCount(mentalCnt);
  }

  public void findMidWife(QHospitalposencoded hospitalposencoded, NumberPath<Double> latPath,
      NumberPath<Double> lonPath, double refLat, double refLon, Productalgorithm productAlgorithm) {
    Double midWifeDist = queryfactory
        .select(calculateDistance(latPath, lonPath, refLat, refLon).min())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isMidwifeHospital.eq(1L))
        .fetchOne();

    Long midWifeCnt = queryfactory
        .select(hospitalposencoded.count())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isMidwifeHospital.eq(1L)
            .and(calculateDistance(latPath, lonPath, refLat, refLon).loe(0.5)))
        .fetchOne();

    productAlgorithm.setMedHospitalDist(midWifeDist);
    productAlgorithm.setMedHospitalCount(midWifeCnt);
  }


  public void findGeneral(QHospitalposencoded hospitalposencoded, NumberPath<Double> latPath,
      NumberPath<Double> lonPath, double refLat, double refLon, Productalgorithm productAlgorithm) {
    Double generalDist = queryfactory
        .select(calculateDistance(latPath, lonPath, refLat, refLon).min())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isGeneralHospital.eq(1L))
        .fetchOne();

    Long generalCnt = queryfactory
        .select(hospitalposencoded.count())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isGeneralHospital.eq(1L)
            .and(calculateDistance(latPath, lonPath, refLat, refLon).loe(0.5)))
        .fetchOne();

    productAlgorithm.setGeneralHospitalDist(generalDist);
    productAlgorithm.setGeneralHospitalCount(generalCnt);
  }

  public void findSmallDental(QHospitalposencoded hospitalposencoded, NumberPath<Double> latPath,
      NumberPath<Double> lonPath, double refLat, double refLon, Productalgorithm productAlgorithm) {
    Double smallDentalDist = queryfactory
        .select(calculateDistance(latPath, lonPath, refLat, refLon).min())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isSmallDentalHospital.eq(1L))
        .fetchOne();

    Long smallDentalCnt = queryfactory
        .select(hospitalposencoded.count())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isSmallDentalHospital.eq(1L)
            .and(calculateDistance(latPath, lonPath, refLat, refLon).loe(0.5)))
        .fetchOne();

    productAlgorithm.setSmallDentalHospitalDist(smallDentalDist);
    productAlgorithm.setSmallDentalHospitalCount(smallDentalCnt);
  }

  public void findSmallOriental(QHospitalposencoded hospitalposencoded, NumberPath<Double> latPath,
      NumberPath<Double> lonPath, double refLat, double refLon, Productalgorithm productAlgorithm) {
    Double smallOrientalDist = queryfactory
        .select(calculateDistance(latPath, lonPath, refLat, refLon).min())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isSmallOrientalHospital.eq(1L))
        .fetchOne();

    Long smallOrientalCnt = queryfactory
        .select(hospitalposencoded.count())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isSmallOrientalHospital.eq(1L)
            .and(calculateDistance(latPath, lonPath, refLat, refLon).loe(0.5)))
        .fetchOne();

    productAlgorithm.setSmallOrientalHospitalDist(smallOrientalDist);
    productAlgorithm.setSmallOrientalHospitalCount(smallOrientalCnt);
  }

  public void findOriental(QHospitalposencoded hospitalposencoded, NumberPath<Double> latPath,
      NumberPath<Double> lonPath, double refLat, double refLon, Productalgorithm productAlgorithm) {
    Double orientalDist = queryfactory
        .select(calculateDistance(latPath, lonPath, refLat, refLon).min())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isOrientalHospital.eq(1L))
        .fetchOne();

    Long orientalCnt = queryfactory
        .select(hospitalposencoded.count())
        .from(hospitalposencoded)
        .where(hospitalposencoded.isOrientalHospital.eq(1L)
            .and(calculateDistance(latPath, lonPath, refLat, refLon).loe(0.5)))
        .fetchOne();

    productAlgorithm.setOrientalHospitalDist(orientalDist);
    productAlgorithm.setOrientalHospitalCount(orientalCnt);
  }

}


