package com.jisang.bangtong.service.preference;

import com.jisang.bangtong.dto.preference.PreferenceDto;
import com.jisang.bangtong.model.preference.Preference;
import com.jisang.bangtong.model.region.Region;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.preference.PreferenceRepository;
import com.jisang.bangtong.repository.region.RegionRepository;
import com.jisang.bangtong.repository.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PreferenceService {

  @Autowired
  private PreferenceRepository preferenceRepository;
  @Autowired
  private RegionRepository regionRepository;
  @Autowired
  private UserRepository userRepository;

  public PreferenceDto addPreference(long userId, PreferenceDto preferenceDto) {
    // 선호 설정 등록
    // String 자료형 / 넘어오는 형태: (예) 서울특별시 / 서울특별시 강서구 / 서울특별시 강서구 가양동
    // 1. '주소' 띄어쓰기 ' ' split = []

    String[] addressParts = preferenceDto.getRegionAddress().split(" ");

    Region region = null;  // Initialize as null
    // 원래 문자열이 null인 경우에는 바로 return null을 때리고 종료
    switch (addressParts.length) {
      case 1:
        region = regionRepository.findByRegionDetails(addressParts[0], "", "").orElse(null);
        break;
      case 2:
        region = regionRepository.findByRegionDetails(addressParts[0], addressParts[1], "")
            .orElse(null);
        break;
      case 3:
        region = regionRepository.findByRegionDetails(addressParts[0], addressParts[1],
            addressParts[2]).orElse(null);
        break;
    }

    User user = userRepository.findById(userId).orElse(null);

    Preference preference = new Preference();
    preference.setPreferenceName(preferenceDto.getPreferenceName());
    preference.setPreferenceDeposit(preferenceDto.getPreferenceDeposit());
    preference.setRegion(region);
    preference.setPreferenceRent(preferenceDto.getPreferenceRent());
    preference.setPreferenceType(preferenceDto.getPreferenceType());
    preference.setPreferenceInfra(preferenceDto.getPreferenceInfra());
    preference.setPreferenceStartDate(preferenceDto.getPreferenceStartDate());
    preference.setPreferenceEndDate(preferenceDto.getPreferenceEndDate());
    preference.setPreferenceId(preferenceDto.getPreferenceId());
    preference.setUser(user);   //지원 추가
    Preference savedPreference = preferenceRepository.save(preference);

    PreferenceDto resultDto = new PreferenceDto();
    resultDto.setPreferenceId(savedPreference.getPreferenceId());
    resultDto.setPreferenceName(savedPreference.getPreferenceName());
    resultDto.setUserId(user.getUserId());
    resultDto.setRegionId(region.getRegionId());
    resultDto.setRegionAddress(preferenceDto.getRegionAddress());
    resultDto.setPreferenceDeposit(savedPreference.getPreferenceDeposit());
    resultDto.setPreferenceRent(savedPreference.getPreferenceRent());
    resultDto.setPreferenceType(savedPreference.getPreferenceType());
    resultDto.setPreferenceInfra(savedPreference.getPreferenceInfra());
    resultDto.setPreferenceStartDate(savedPreference.getPreferenceStartDate());
    resultDto.setPreferenceEndDate(savedPreference.getPreferenceEndDate());

    return resultDto;
  }

  // 선호 설정 수정
  public PreferenceDto modifyPreference(long preferenceId, PreferenceDto preferenceDto) {
    Preference existingPreference = preferenceRepository.findByPreferenceId(preferenceId);

    existingPreference.setPreferenceName(preferenceDto.getPreferenceName());
    existingPreference.setPreferenceDeposit(preferenceDto.getPreferenceDeposit());
    existingPreference.setPreferenceRent(preferenceDto.getPreferenceRent());
    existingPreference.setPreferenceType(preferenceDto.getPreferenceType());
    existingPreference.setPreferenceInfra(preferenceDto.getPreferenceInfra());
    existingPreference.setPreferenceStartDate(preferenceDto.getPreferenceStartDate());
    existingPreference.setPreferenceEndDate(preferenceDto.getPreferenceEndDate());

    String[] addressParts = preferenceDto.getRegionAddress().split(" ");
    Region region = null;  // Initialize as null

    switch (addressParts.length) {
      case 1:
        region = regionRepository.findByRegionDetails(addressParts[0], "", "").orElse(null);
        break;
      case 2:
        region = regionRepository.findByRegionDetails(addressParts[0], addressParts[1], "")
            .orElse(null);
        break;
      case 3:
        region = regionRepository.findByRegionDetails(addressParts[0], addressParts[1],
            addressParts[2]).orElse(null);
        break;
    }
    existingPreference.setRegion(region);

    Preference updatePreference = preferenceRepository.save(existingPreference);

    PreferenceDto updatePreferenceDto = new PreferenceDto();
    updatePreferenceDto.setPreferenceId(updatePreference.getPreferenceId());
    updatePreferenceDto.setPreferenceName(updatePreference.getPreferenceName());
    updatePreferenceDto.setPreferenceDeposit(updatePreference.getPreferenceDeposit());
    updatePreferenceDto.setPreferenceRent(updatePreference.getPreferenceRent());
    updatePreferenceDto.setPreferenceType(updatePreference.getPreferenceType());
    updatePreferenceDto.setPreferenceInfra(updatePreference.getPreferenceInfra());
    updatePreferenceDto.setPreferenceStartDate(updatePreference.getPreferenceStartDate());
    updatePreferenceDto.setPreferenceEndDate(updatePreference.getPreferenceEndDate());

    Region regionEntity = updatePreference.getRegion();
    if (regionEntity != null) {
      updatePreferenceDto.setRegionId(regionEntity.getRegionId());  // Use original 8-digit ID
      StringBuilder sb = new StringBuilder();
      sb.append(regionEntity.getRegionSido())
          .append(" ")
          .append(regionEntity.getRegionGugun())
          .append(" ")
          .append(regionEntity.getRegionDong());
      updatePreferenceDto.setRegionAddress(sb.toString().trim());
    } else {
      updatePreferenceDto.setRegionId(null);
      updatePreferenceDto.setRegionAddress("");
    }

    return updatePreferenceDto;
  }

  // 선호 설정 삭제
  public void deletePreference(long preferenceId) {
    preferenceRepository.deleteById(preferenceId);
  }

  // 선호 설정 불러오기
  public PreferenceDto getPreference(long preferenceId) {
    PreferenceDto dto = new PreferenceDto();

    try {
      Preference result = preferenceRepository.findByPreferenceId(preferenceId);

      if (result != null) {
        dto.setPreferenceId(result.getPreferenceId());
        dto.setPreferenceName(result.getPreferenceName());
        dto.setUserId(result.getUser().getUserId());
        dto.setPreferenceDeposit(result.getPreferenceDeposit());
        dto.setPreferenceRent(result.getPreferenceRent());
        dto.setPreferenceType(result.getPreferenceType());
        dto.setPreferenceInfra(result.getPreferenceInfra());
        dto.setPreferenceStartDate(result.getPreferenceStartDate());
        dto.setPreferenceEndDate(result.getPreferenceEndDate());

        Region region = result.getRegion();
        if (region != null) {
          dto.setRegionId(region.getRegionId());  // Use original 8-digit ID

          StringBuilder sb = new StringBuilder();
          sb.append(region.getRegionSido())
              .append(" ")
              .append(region.getRegionGugun())
              .append(" ")
              .append(region.getRegionDong());
          dto.setRegionAddress(sb.toString().trim());
        } else {
          dto.setRegionId(null);
          dto.setRegionAddress("");
        }
      }
    } catch (Exception e) {
      return null;
    }
    return dto;
  }

  public List<PreferenceDto> getPreferenceList(long userId) {
    List<PreferenceDto> resultDto = new ArrayList<>();
    List<Preference> result = preferenceRepository.findAllByUser_UserId(userId);

    for (Preference preference : result) {
      PreferenceDto dto = new PreferenceDto();
      dto.setPreferenceId(preference.getPreferenceId());
      dto.setPreferenceName(preference.getPreferenceName());
      dto.setUserId(preference.getUser().getUserId());
      dto.setPreferenceDeposit(preference.getPreferenceDeposit());
      dto.setPreferenceRent(preference.getPreferenceRent());
      dto.setPreferenceType(preference.getPreferenceType());
      dto.setPreferenceInfra(preference.getPreferenceInfra());
      dto.setPreferenceStartDate(preference.getPreferenceStartDate());
      dto.setPreferenceEndDate(preference.getPreferenceEndDate());
      Region region = preference.getRegion();
      if (region != null) {
        dto.setRegionId(region.getRegionId());
        StringBuilder sb = new StringBuilder();
        sb.append(region.getRegionSido())
            .append(" ")
            .append(region.getRegionGugun())
            .append(" ")
            .append(region.getRegionDong());
        dto.setRegionAddress(sb.toString().trim());
      } else {
        dto.setRegionId(null);
        dto.setRegionAddress("");
      }
      resultDto.add(dto);
    }
    return resultDto;
  }
}
