package com.jisang.bangtong.repository.region;

import static com.jisang.bangtong.model.region.QRegion.region;

import com.jisang.bangtong.dto.region.RegionDongDto;
import com.jisang.bangtong.dto.region.RegionGugunDto;
import com.jisang.bangtong.dto.region.RegionSidoDto;
import com.jisang.bangtong.model.region.QRegion;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class RegionRepositoryCustomImpl implements RegionRepositoryCustom {

  @Autowired
  private JPAQueryFactory queryFactory;

  @Override
  public List<RegionSidoDto> searchSido() {
    QRegion qRegion = region;

    return queryFactory
        .select(Projections.constructor(RegionSidoDto.class,
            qRegion.regionId.substring(0, 2).as("regionId"),
            qRegion.regionSido))
        .from(qRegion)
        .groupBy(qRegion.regionId.substring(0, 2))
        .distinct()
        .fetch();
  }

  @Override
  public List<RegionGugunDto> searchGugun(String sido) {
    List<RegionGugunDto> results = queryFactory
        .select(Projections.constructor(RegionGugunDto.class,
            region.regionId.substring(0, 4).as("regionId"), region.regionGugun))
        .from(region)
        .where(region.regionId.substring(0, 2).eq(sido)
            .and(region.regionGugun.length().gt(0))
            )
        .groupBy(region.regionId.substring(0, 4), region.regionGugun)
        .distinct()
        .fetch();

    return results;
  }

  @Override
  public List<RegionDongDto> searchDong(String gugun) {
    List<RegionDongDto> results = queryFactory
        .select(Projections.constructor(RegionDongDto.class, region.regionId.as("regionId"),
            region.regionDong))
        .from(region)
        .where(region.regionId.substring(0, 4).eq(gugun)
            .and(region.regionDong.length().gt(0)))
        .groupBy(region.regionId.substring(0), region.regionDong)
        .distinct()
        .fetch();
    return results;
  }
}
