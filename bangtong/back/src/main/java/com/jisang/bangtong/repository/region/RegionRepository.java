package com.jisang.bangtong.repository.region;

import com.jisang.bangtong.model.region.Region;
import org.hibernate.annotations.SQLSelect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RegionRepository extends JpaRepository<Region, String>, RegionRepositoryCustom {
    @Query("SELECT r FROM Region r WHERE r.regionSido = :regionSido AND r.regionGugun = :regionGugun AND r.regionDong like :regionDong%")
    Optional<Region> findByRegionDetails(@Param("regionSido") String regionSido, @Param("regionGugun") String regionGugun, @Param("regionDong") String regionDong);
}